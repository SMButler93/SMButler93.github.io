import { BOOT_SEQUENCE, PROMPT, complete, runCommand, suggest } from './commands';
import type { CommandEffect, Line } from './types';

export interface TerminalElements {
  readonly log: HTMLElement;
  readonly form: HTMLFormElement;
  readonly input: HTMLInputElement;
  readonly suggestions: HTMLElement;
}

export interface TerminalOptions {
  /** Delay between boot lines, in ms. Use 0 for reduced motion. */
  readonly bootStepMs?: number;
  readonly onExit: () => void;
}

export class Terminal {
  readonly #elements: TerminalElements;
  readonly #options: Required<TerminalOptions>;
  readonly #history: string[] = [];
  #historyIndex = 0;
  #timers: number[] = [];

  constructor(elements: TerminalElements, options: TerminalOptions) {
    this.#elements = elements;
    this.#options = { bootStepMs: 170, ...options };

    elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.execute(elements.input.value);
    });
    elements.input.addEventListener('input', () => this.#renderSuggestions());
    elements.input.addEventListener('keydown', (event) => this.#onKeyDown(event));
    elements.log.addEventListener('click', () => {
      // Clicking the log focuses the prompt, unless the user is selecting text.
      if (!window.getSelection()?.toString()) this.focus();
    });
  }

  boot(): void {
    this.reset();
    const { bootStepMs } = this.#options;
    BOOT_SEQUENCE.forEach((line, index) => {
      this.#timers.push(window.setTimeout(() => this.#print([line]), bootStepMs * (index + 1)));
    });
    this.#timers.push(
      window.setTimeout(
        () => {
          this.#elements.form.hidden = false;
          this.#renderSuggestions();
          this.focus();
        },
        bootStepMs * (BOOT_SEQUENCE.length + 1),
      ),
    );
  }

  reset(): void {
    this.#timers.forEach((timer) => window.clearTimeout(timer));
    this.#timers = [];
    this.#elements.log.replaceChildren();
    this.#elements.suggestions.replaceChildren();
    this.#elements.form.hidden = true;
    this.#elements.input.value = '';
  }

  focus(): void {
    if (!this.#elements.form.hidden) this.#elements.input.focus({ preventScroll: true });
  }

  execute(rawInput: string): void {
    const input = rawInput.trim();
    this.#print([{ text: `${PROMPT} ${input}`, tone: 'command' }]);
    if (input) this.#history.push(input);
    this.#historyIndex = this.#history.length;
    this.#elements.input.value = '';

    const result = runCommand(input);
    this.#print(result.lines);
    if (result.effect) this.#apply(result.effect);
    // Exiting resets the terminal; don't repopulate it afterwards.
    if (result.effect?.type !== 'exit') this.#renderSuggestions();
  }

  #apply(effect: CommandEffect): void {
    switch (effect.type) {
      case 'clear':
        this.#elements.log.replaceChildren();
        break;
      case 'exit':
        this.#options.onExit();
        break;
      case 'navigate':
        window.location.assign(effect.href);
        break;
      case 'open':
        if (effect.url.startsWith('mailto:')) window.location.href = effect.url;
        else window.open(effect.url, '_blank', 'noopener,noreferrer');
        break;
    }
  }

  #print(lines: readonly Line[]): void {
    if (lines.length === 0) return;
    const fragment = document.createDocumentFragment();
    for (const { text, tone = 'default' } of lines) {
      const element = document.createElement('div');
      element.className = 'terminal-line';
      element.dataset.tone = tone;
      element.textContent = text;
      fragment.append(element);
    }
    this.#elements.log.append(fragment);
    this.#elements.log.scrollTop = this.#elements.log.scrollHeight;
  }

  #renderSuggestions(): void {
    const buttons = suggest(this.#elements.input.value).map((command) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'terminal-suggestion';
      button.textContent = command;
      button.addEventListener('click', () => {
        this.execute(command);
        this.focus();
      });
      return button;
    });
    this.#elements.suggestions.replaceChildren(...buttons);
  }

  #onKeyDown(event: KeyboardEvent): void {
    const { input } = this.#elements;
    switch (event.key) {
      case 'Tab': {
        const completed = complete(input.value);
        if (completed === input.value) return; // Let Tab move focus when there is nothing to complete.
        event.preventDefault();
        input.value = completed;
        this.#renderSuggestions();
        break;
      }
      case 'ArrowUp':
        if (this.#history.length === 0) return;
        event.preventDefault();
        this.#historyIndex = Math.max(0, this.#historyIndex - 1);
        input.value = this.#history[this.#historyIndex] ?? '';
        break;
      case 'ArrowDown':
        if (this.#history.length === 0) return;
        event.preventDefault();
        this.#historyIndex = Math.min(this.#history.length, this.#historyIndex + 1);
        input.value = this.#history[this.#historyIndex] ?? '';
        break;
      case 'Escape':
        event.preventDefault();
        this.#options.onExit();
        break;
    }
  }
}
