export type LineTone = 'default' | 'muted' | 'accent' | 'info' | 'success' | 'error' | 'command';

export interface Line {
  readonly text: string;
  readonly tone?: LineTone;
}

export type CommandEffect =
  | { readonly type: 'clear' }
  | { readonly type: 'exit' }
  | { readonly type: 'navigate'; readonly href: string }
  | { readonly type: 'open'; readonly url: string };

export interface CommandResult {
  readonly lines: readonly Line[];
  readonly effect?: CommandEffect;
}
