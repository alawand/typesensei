import type { Language, Snippet } from './snippets';

/** A bank of real, plausible code lines, each tagged with the symbols it stresses.
 *  Drills are assembled from these so practice stays realistic (not random gibberish). */
const TEMPLATES: { syms: string[]; line: string }[] = [
  { syms: ['{', '}'], line: 'if (ready) { start(); }' },
  { syms: ['{', '}', ';'], line: 'while (n > 0) { n = n - 1; }' },
  { syms: ['(', ')', ';'], line: 'init(config, retries, timeout);' },
  { syms: ['[', ']', '='], line: 'items[i] = items[i - 1];' },
  { syms: ['<', '>'], line: 'List<Map<String, Integer>> rows;' },
  { syms: ['=', '>', '(', ')'], line: 'const f = (x) => x * 2;' },
  { syms: [';', '=', '+'], line: 'let total = a + b + c;' },
  { syms: ['{', '}', ':', ','], line: 'point = { x: 1, y: 2, z: 3 };' },
  { syms: ['_', '='], line: 'const max_retry_count = default_value;' },
  { syms: ['.', '(', ')'], line: 'user.profile.update(name, email);' },
  { syms: ['/', '*'], line: 'ratio = (width * scale) / height;' },
  { syms: ['&', '|'], line: 'flags = READ | WRITE & MASK;' },
  { syms: ['"', '+'], line: 'print("hello, " + name + "!");' },
  { syms: ["'"], line: "label = 'ok';" },
  { syms: ['?', ':'], line: 'status = ok ? 200 : 500;' },
  { syms: ['%'], line: 'rem = total % bucket_size;' },
  { syms: ['+', '-'], line: 'delta = end - start + offset;' },
  { syms: ['#', '<', '>'], line: '#include <stdio.h>' },
  { syms: ['\\', '"'], line: 'path = "root\\\\tmp\\\\out.log";' },
  { syms: ['`', '$', '{', '}'], line: 'msg = `value is ${count}`;' },
  { syms: ['@', '(', ')'], line: '@Override public void run() {}' },
  { syms: ['^', '~', '|'], line: 'mask = (a ^ b) | ~c;' },
];

/** Build a ~`lines`-line drill weighted toward the user's weak symbols. Falls back to
 *  a general drill when there's no weakness data yet. Returns a normal Snippet so it
 *  runs through the existing typing flow (and feeds keyStats on completion). */
export function buildDrill(weakChars: string[], lang: Language, lines = 14): Snippet {
  const weak = new Set(weakChars);
  const scored = TEMPLATES.map((t) => ({
    t,
    score: t.syms.reduce((n, s) => n + (weak.has(s) ? 1 : 0), 0),
  }));

  let pool = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.t.line);
  if (pool.length === 0) pool = TEMPLATES.map((t) => t.line);

  const out: string[] = [];
  for (let i = 0; i < lines; i++) out.push(pool[i % pool.length]);

  const symbolsOnly = weakChars.filter((c) => /[^\w\s]/.test(c));
  const label = symbolsOnly.slice(0, 4).join(' ') || 'symbols';
  return {
    id: `drill-${Math.floor(Math.random() * 1e9)}`,
    language: lang,
    title: `Drill: ${label}`,
    source: out.join('\n'),
  };
}
