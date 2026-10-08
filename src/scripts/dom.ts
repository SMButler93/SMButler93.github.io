export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Queries a required element, failing loudly if the markup and script drift apart. */
export function getRequired<T extends Element>(
  root: ParentNode,
  selector: string,
  type: { new (): T; readonly name: string },
): T {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) {
    throw new Error(`Expected ${type.name} for selector "${selector}"`);
  }
  return element;
}
