export type TokenKind = 'keyword' | 'type' | 'string' | 'comment' | 'method' | 'property' | 'plain';

export interface Token {
  readonly text: string;
  readonly kind: TokenKind;
}

const KEYWORDS = new Set([
  'var',
  'new',
  'await',
  'async',
  'true',
  'false',
  'null',
  'public',
  'private',
  'class',
  'record',
  'string',
  'return',
]);

// Order matters: comments and strings must win over identifiers.
const TOKEN_PATTERN = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;

function classifyIdentifier(word: string, rest: string): TokenKind {
  if (KEYWORDS.has(word)) return 'keyword';
  if (rest.startsWith('(')) return 'method';
  const next = rest.trimStart();
  const isPascalCase = /^[A-Z]/.test(word);
  // `Name = …` in an object initialiser, or a named argument such as `scalable: true`.
  if (isPascalCase && next.startsWith('=') && !next.startsWith('==')) return 'property';
  if (next.startsWith(':')) return 'property';
  return isPascalCase ? 'type' : 'plain';
}

/**
 * A deliberately small C# highlighter for short, trusted snippets.
 * It runs at build time, so no highlighting library ships to the browser.
 */
export function tokenizeCSharp(source: string): Token[] {
  const tokens: Token[] = [];
  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const [text, comment, string, identifier] = match;
    const end = (match.index ?? 0) + text.length;
    let kind: TokenKind = 'plain';
    if (comment) kind = 'comment';
    else if (string) kind = 'string';
    else if (identifier) kind = classifyIdentifier(identifier, source.slice(end));

    const previous = tokens.at(-1);
    if (previous && previous.kind === kind && kind === 'plain') {
      tokens[tokens.length - 1] = { kind, text: previous.text + text };
    } else {
      tokens.push({ kind, text });
    }
  }
  return tokens;
}
