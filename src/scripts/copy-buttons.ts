const RESET_AFTER_MS = 2000;

/**
 * Enhances `<button data-copy="text">` elements. Buttons stay hidden unless the
 * Clipboard API is available, so the page never shows a control that cannot work.
 */
export function initCopyButtons(root: ParentNode = document): void {
  if (!navigator.clipboard) return;

  for (const button of root.querySelectorAll<HTMLButtonElement>('button[data-copy]')) {
    const label = button.textContent ?? '';
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    let timer: number | undefined;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.textContent = 'Copied ✓';
        if (status) status.textContent = 'Email address copied to clipboard';
      } catch {
        button.textContent = 'Copy failed';
        if (status) status.textContent = 'Could not copy the email address';
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.textContent = label;
        if (status) status.textContent = '';
      }, RESET_AFTER_MS);
    });

    button.hidden = false;
  }
}
