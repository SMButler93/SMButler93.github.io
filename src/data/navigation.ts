export interface NavItem {
  readonly label: string;
  /** Route path with a trailing slash, matching `build.format: 'directory'`. */
  readonly href: `/${string}`;
}

export const navigation: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Experience', href: '/experience/' },
  { label: 'Skills', href: '/skills/' },
  { label: 'Contact', href: '/contact/' },
];

/** Normalises a pathname so `/about`, `/about/` and `/about/index.html` compare equal. */
export function normalisePath(pathname: string): string {
  const trimmed = pathname.replace(/index\.html$/, '').replace(/\/+$/, '');
  return trimmed === '' ? '/' : `${trimmed}/`;
}

export function isCurrentPath(href: string, pathname: string): boolean {
  return normalisePath(href) === normalisePath(pathname);
}
