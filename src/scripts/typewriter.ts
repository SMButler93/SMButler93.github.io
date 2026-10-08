export interface Typewriter {
  /** Immediately reveal everything. */
  finish(): void;
  /** Restart the animation from the beginning. */
  restart(): void;
}

interface TextSegment {
  readonly node: Text;
  readonly text: string;
}

/**
 * Types out the text content of `target` while preserving its markup
 * (e.g. syntax-highlighting spans). Time-based, so speed is frame-rate independent.
 */
export function createTypewriter(
  target: HTMLElement,
  { charactersPerSecond = 95, instant = false } = {},
): Typewriter {
  const segments: TextSegment[] = [];
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    segments.push({ node, text: node.data });
  }
  const total = segments.reduce((sum, segment) => sum + segment.text.length, 0);

  let frame = 0;
  let startedAt: number | undefined;

  const render = (visible: number): void => {
    let remaining = visible;
    for (const { node, text } of segments) {
      const length = Math.min(text.length, Math.max(remaining, 0));
      if (node.data.length !== length) node.data = text.slice(0, length);
      remaining -= text.length;
    }
  };

  const markDone = (): void => {
    target.dataset.typewriter = 'done';
  };

  const tick = (now: number): void => {
    startedAt ??= now;
    const visible = Math.floor(((now - startedAt) / 1000) * charactersPerSecond);
    render(visible);
    if (visible < total) frame = requestAnimationFrame(tick);
    else markDone();
  };

  const finish = (): void => {
    cancelAnimationFrame(frame);
    render(total);
    markDone();
  };

  const restart = (): void => {
    cancelAnimationFrame(frame);
    if (instant) return finish();
    startedAt = undefined;
    render(0);
    target.dataset.typewriter = 'typing';
    frame = requestAnimationFrame(tick);
  };

  restart();
  return { finish, restart };
}
