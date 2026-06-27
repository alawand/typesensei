import { describe, it, expect } from 'vitest';
import { buildDrill } from './drills';

describe('buildDrill', () => {
  it('produces a non-empty multi-line drill heavy in the requested weak symbols', () => {
    const d = buildDrill(['{', ';'], 'java');
    expect(d.source.length).toBeGreaterThan(0);
    expect(d.source.split('\n').length).toBeGreaterThanOrEqual(10);
    expect(d.source).toContain('{');
    expect(d.source).toContain(';');
    expect(d.language).toBe('java');
    expect(d.id).toMatch(/^drill-/);
  });

  it('falls back to a general drill when there is no weakness data', () => {
    const d = buildDrill([], 'c');
    expect(d.source.split('\n').length).toBeGreaterThanOrEqual(10);
    expect(d.title).toContain('symbols');
  });

  it('labels the drill with the weak symbols (ignoring letters)', () => {
    const d = buildDrill(['[', 'a'], 'python');
    expect(d.title).toContain('[');
    expect(d.title).not.toContain('a');
  });
});
