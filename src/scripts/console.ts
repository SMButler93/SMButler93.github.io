import { getRequired, prefersReducedMotion } from './dom';
import { Terminal } from './terminal/terminal';
import { createTypewriter } from './typewriter';

const LABELS = {
  code: {
    title: 'Scott.cs',
    button: '▶ dotnet run',
    aria: 'Run the code and open an interactive terminal',
  },
  terminal: { title: 'bash — scott@portfolio', button: '■ exit', aria: 'Exit the terminal' },
} as const;

/** Wires up the home page console: typed C# snippet plus an opt-in terminal. */
export function initConsole(root: HTMLElement): void {
  const reducedMotion = prefersReducedMotion();
  const code = getRequired(root, '[data-console-code]', HTMLElement);
  const snippet = getRequired(code, 'pre', HTMLPreElement);
  const title = getRequired(root, '[data-console-title]', HTMLElement);
  const toggle = getRequired(root, '[data-console-toggle]', HTMLButtonElement);
  const panel = getRequired(root, '[data-terminal]', HTMLElement);

  const typewriter = createTypewriter(snippet, { instant: reducedMotion });

  let isOpen = false;
  const setOpen = (open: boolean): void => {
    isOpen = open;
    const labels = open ? LABELS.terminal : LABELS.code;
    title.textContent = labels.title;
    toggle.textContent = labels.button;
    toggle.setAttribute('aria-label', labels.aria);
    toggle.setAttribute('aria-expanded', String(open));
    code.hidden = open;
    panel.hidden = !open;

    if (open) {
      typewriter.finish();
      terminal.boot();
    } else {
      terminal.reset();
    }
  };

  const terminal = new Terminal(
    {
      log: getRequired(panel, '[data-terminal-log]', HTMLElement),
      form: getRequired(panel, '[data-terminal-form]', HTMLFormElement),
      input: getRequired(panel, '[data-terminal-input]', HTMLInputElement),
      suggestions: getRequired(panel, '[data-terminal-suggestions]', HTMLElement),
    },
    {
      bootStepMs: reducedMotion ? 0 : 170,
      onExit: () => {
        setOpen(false);
        toggle.focus();
      },
    },
  );

  toggle.addEventListener('click', () => setOpen(!isOpen));
  toggle.hidden = false;
}
