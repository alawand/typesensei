import type { Language, Snippet } from './snippets';

/** Turn pasted text into a typeable Snippet: normalize newlines, strip trailing
 *  whitespace (un-typeable invisible spaces), drop leading/trailing blank lines, and
 *  collapse runs of blank lines. Returns null if there's nothing usable. */
export function buildCustomSnippet(text: string, language: Language): Snippet | null {
  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  const source = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  if (!source.trim()) return null;
  return {
    id: `custom-${Math.floor(Math.random() * 1e9)}`,
    language,
    title: 'Your code',
    source,
  };
}
