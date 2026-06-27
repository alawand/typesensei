import type { RunMetrics } from '../engine/metrics';
import {
  getAllKeyStats,
  getUnlockedAchievements,
  unlockAchievement,
  type SaveResult,
} from './db';

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'clean-run', name: 'Flawless', desc: 'Finish a run with zero typo cost' },
  { id: 'combo-100', name: 'In the Zone', desc: 'Reach a 100 combo' },
  { id: 'streak-7', name: 'Week Warrior', desc: 'Keep a 7-day streak' },
  { id: 'first-mastery', name: 'Sharpened', desc: 'Master your first symbol' },
  { id: 'gauntlet-clear', name: 'Gauntlet Run', desc: 'Clear a full Symbol Gauntlet' },
];

async function hasMasteredSymbol(): Promise<boolean> {
  const rows = await getAllKeyStats();
  return rows.some((k) => k.attempts >= 10 && k.errors / k.attempts < 0.02);
}

/** Persist any of `ids` not already unlocked; return the freshly-unlocked defs. */
async function commit(ids: string[]): Promise<AchievementDef[]> {
  const unlocked = await getUnlockedAchievements();
  const newly: AchievementDef[] = [];
  for (const id of ids) {
    if (unlocked.has(id)) continue;
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    if (!def) continue;
    await unlockAchievement(id);
    newly.push(def);
  }
  return newly;
}

/** Evaluate per-run achievements after a completed run. */
export async function evaluateRun(ctx: { metrics: RunMetrics; save: SaveResult }): Promise<AchievementDef[]> {
  const { metrics: m, save } = ctx;
  const earned: string[] = [];
  if (m.correctChars >= 20 && m.typoCost === 0) earned.push('clean-run');
  if (m.maxCombo >= 100) earned.push('combo-100');
  if (save.streak >= 7) earned.push('streak-7');
  if (await hasMasteredSymbol()) earned.push('first-mastery');
  return commit(earned);
}

/** Award the gauntlet achievement (call when a full gauntlet is cleared). */
export function unlockGauntlet(): Promise<AchievementDef[]> {
  return commit(['gauntlet-clear']);
}
