/**
 * Accessible tabs following the WAI-ARIA Authoring Practices pattern.
 * Without JavaScript the tablist stays hidden and every panel is visible.
 */
export function initTabs(root: HTMLElement): void {
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  if (tabs.length === 0) return;

  const panelFor = (tab: HTMLButtonElement): HTMLElement | null => {
    const id = tab.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };

  const select = (selected: HTMLButtonElement, moveFocus = false): void => {
    for (const tab of tabs) {
      const isSelected = tab === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      const panel = panelFor(tab);
      if (panel) panel.hidden = !isSelected;
    }
    if (moveFocus) selected.focus();
  };

  tablist.addEventListener('click', (event) => {
    const tab = (event.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (tab) select(tab);
  });

  tablist.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const last = tabs.length - 1;
    const next: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    const index = next[event.key];
    const target = index === undefined ? undefined : tabs[index];
    if (!target) return;
    event.preventDefault();
    select(target, true);
  });

  const initial = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0];
  if (initial) select(initial);
  tablist.hidden = false;
}
