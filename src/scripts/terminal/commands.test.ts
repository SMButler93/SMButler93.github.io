import { describe, expect, it } from 'vitest';
import { COMMANDS, DEFAULT_SUGGESTIONS, complete, runCommand, suggest } from './commands';

describe('runCommand', () => {
  it('returns nothing for empty input', () => {
    expect(runCommand('   ')).toEqual({ lines: [] });
  });

  it('is case- and whitespace-insensitive', () => {
    expect(runCommand('  WHOAMI ').lines[0]?.text).toBe('Scott Butler');
  });

  it('reports unknown commands, including Object.prototype keys', () => {
    for (const input of ['foo', 'constructor', 'toString', '__proto__']) {
      const [line] = runCommand(input).lines;
      expect(line?.tone).toBe('error');
      expect(line?.text).toContain('command not found');
    }
  });

  it('navigates with cd', () => {
    expect(runCommand('cd skills').effect).toEqual({ type: 'navigate', href: '/skills/' });
    expect(runCommand('cd nowhere').lines[0]?.tone).toBe('error');
    expect(runCommand('cd').effect).toBeUndefined();
  });

  it('opens known links only', () => {
    expect(runCommand('open github').effect).toEqual({
      type: 'open',
      url: 'https://github.com/SMButler93',
    });
    expect(runCommand('open constructor').effect).toBeUndefined();
  });

  it('includes tenure in experience output', () => {
    const lines = runCommand('experience', new Date(2026, 9, 8)).lines.map((line) => line.text);
    expect(lines).toContain('Sep 2023 – Present (3 yrs 2 mos)');
  });

  it('emits clear and exit effects', () => {
    expect(runCommand('clear').effect).toEqual({ type: 'clear' });
    expect(runCommand('exit').effect).toEqual({ type: 'exit' });
  });

  it('has a handler for every advertised command', () => {
    for (const command of COMMANDS) {
      expect(runCommand(command).lines.some((line) => line.tone === 'error')).toBe(false);
    }
  });
});

describe('complete', () => {
  it('completes a unique prefix', () => {
    expect(complete('exp')).toBe('experience');
  });

  it('completes to the longest shared prefix', () => {
    expect(complete('op')).toBe('open ');
  });

  it('leaves unmatched input untouched', () => {
    expect(complete('zzz')).toBe('zzz');
    expect(complete('')).toBe('');
  });
});

describe('suggest', () => {
  it('falls back to defaults', () => {
    expect(suggest('')).toBe(DEFAULT_SUGGESTIONS);
    expect(suggest('zzz')).toBe(DEFAULT_SUGGESTIONS);
  });

  it('filters by prefix and excludes exact matches', () => {
    expect(suggest('cd ')).toEqual(['cd about', 'cd experience', 'cd skills', 'cd contact']);
    expect(suggest('help')).toBe(DEFAULT_SUGGESTIONS);
  });
});
