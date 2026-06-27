import Dexie, { type Table } from 'dexie';
import type { RunMetrics } from '../engine/metrics';
import type { Snippet } from '../content/snippets';

export interface RunRecord {
  id?: number;
  snippetId: string;
  language: string;
  startedAt: number; // ms epoch
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  typoCost: number;
  correctChars: number;
  durationMs: number;
}

export interface KeyStat {
  char: string; // primary key
  attempts: number;
  errors: number;
}

export interface DayStat {
  date: string; // yyyy-mm-dd (local), primary key
  runs: number;
  correctChars: number;
  msTyped: number;
}

class TypesenseiDB extends Dexie {
  runs!: Table<RunRecord, number>;
  keyStats!: Table<KeyStat, string>;
  days!: Table<DayStat, string>;

  constructor() {
    super('typesensei');
    this.version(1).stores({
      runs: '++id, startedAt, snippetId, language',
      keyStats: 'char',
      days: 'date',
    });
  }
}

export const db = new TypesenseiDB();

/** Clean keystrokes per day to keep a streak alive. */
export const DAILY_GOAL_CHARS = 800;

export interface SaveResult {
  streak: number;
  todayCorrectChars: number;
  goal: number;
}

function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Count consecutive days with activity, ending today (or yesterday if today is
 *  still empty so an in-progress day doesn't reset a streak). */
async function computeStreak(): Promise<number> {
  const active = new Set((await db.days.toArray()).map((d) => d.date));
  const cursor = new Date();
  if (!active.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (active.has(localDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

async function progressForToday(): Promise<SaveResult> {
  const today = await db.days.get(localDate());
  return {
    streak: await computeStreak(),
    todayCorrectChars: today?.correctChars ?? 0,
    goal: DAILY_GOAL_CHARS,
  };
}

/** Persist a completed run: append the run, accumulate per-key stats, and roll up
 *  today's activity — all in one transaction. Returns updated streak/goal info. */
export async function saveRun(snippet: Snippet, m: RunMetrics): Promise<SaveResult> {
  const startedAt = Date.now() - m.durationMs;
  const today = localDate();

  await db.transaction('rw', db.runs, db.keyStats, db.days, async () => {
    await db.runs.add({
      snippetId: snippet.id,
      language: snippet.language,
      startedAt,
      wpm: m.wpm,
      rawWpm: m.rawWpm,
      accuracy: m.accuracy,
      consistency: m.consistency,
      typoCost: m.typoCost,
      correctChars: m.correctChars,
      durationMs: m.durationMs,
    });

    for (const k of m.perKey) {
      const prev = await db.keyStats.get(k.char);
      await db.keyStats.put({
        char: k.char,
        attempts: (prev?.attempts ?? 0) + k.attempts,
        errors: (prev?.errors ?? 0) + k.errors,
      });
    }

    const day = await db.days.get(today);
    await db.days.put({
      date: today,
      runs: (day?.runs ?? 0) + 1,
      correctChars: (day?.correctChars ?? 0) + m.correctChars,
      msTyped: (day?.msTyped ?? 0) + m.durationMs,
    });
  });

  return progressForToday();
}

/** Streak + today's progress without recording a run (e.g. on app load). */
export function getDailyProgress(): Promise<SaveResult> {
  return progressForToday();
}

/** Every accumulated per-key stat (for the mastery map). */
export function getAllKeyStats(): Promise<KeyStat[]> {
  return db.keyStats.toArray();
}

/** All-time weakest keys by error rate (then absolute errors), errors only. */
export async function getTopProblemKeys(limit = 8): Promise<KeyStat[]> {
  const all = await db.keyStats.toArray();
  return all
    .filter((k) => k.errors > 0)
    .sort((a, b) => b.errors / b.attempts - a.errors / a.attempts || b.errors - a.errors)
    .slice(0, limit);
}
