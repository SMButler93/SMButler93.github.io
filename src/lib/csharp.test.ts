import { describe, expect, it } from 'vitest';
import { tokenizeCSharp, type TokenKind } from './csharp';

const kindsOf = (source: string): Array<[string, TokenKind]> =>
  tokenizeCSharp(source)
    .filter((token) => token.kind !== 'plain')
    .map((token) => [token.text, token.kind]);

describe('tokenizeCSharp', () => {
  it('round-trips the source text exactly', () => {
    const source = 'var app = builder.Build();\n// done';
    expect(
      tokenizeCSharp(source)
        .map((token) => token.text)
        .join(''),
    ).toBe(source);
  });

  it('classifies keywords, types, methods, properties, strings and comments', () => {
    expect(kindsOf('var scott = new Engineer { Name = "Scott" };')).toEqual([
      ['var', 'keyword'],
      ['new', 'keyword'],
      ['Engineer', 'type'],
      ['Name', 'property'],
      ['"Scott"', 'string'],
    ]);
    expect(kindsOf('await scott.BuildAsync(scalable: true); // ok')).toEqual([
      ['await', 'keyword'],
      ['BuildAsync', 'method'],
      ['scalable', 'property'],
      ['true', 'keyword'],
      ['// ok', 'comment'],
    ]);
  });

  it('does not treat comparison as assignment', () => {
    expect(kindsOf('Count == 1')).toEqual([['Count', 'type']]);
  });

  it('keeps escaped quotes inside strings', () => {
    expect(kindsOf('"say \\"hi\\""')).toEqual([['"say \\"hi\\""', 'string']]);
  });
});
