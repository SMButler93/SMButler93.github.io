import { formatTenure, type YearMonth } from '@/lib/dates';

/**
 * Durations are rendered at build time; refresh them in the browser so they
 * stay accurate between deploys.
 */
export function refreshDurations(root: ParentNode = document): void {
  for (const element of root.querySelectorAll<HTMLElement>('[data-duration-since]')) {
    const since = element.dataset.durationSince as YearMonth | undefined;
    if (!since) continue;
    try {
      element.textContent = formatTenure(since);
    } catch {
      // Keep the build-time value if the attribute is malformed.
    }
  }
}
