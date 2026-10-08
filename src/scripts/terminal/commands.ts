import { currentRole } from '@/data/experience';
import { navigation } from '@/data/navigation';
import { profile } from '@/data/profile';
import { skillGroups } from '@/data/skills';
import { formatTenure, formatYearMonth } from '@/lib/dates';
import type { CommandResult, Line } from './types';

export const PROMPT = 'scott@portfolio:~$';

// Maps (not object literals) so inputs like `constructor` never hit Object.prototype.
const LINKS: ReadonlyMap<string, string> = new Map([
  ['github', profile.social.github.url],
  ['linkedin', profile.social.linkedin.url],
  ['email', `mailto:${profile.email}`],
]);
const LINK_NAMES = [...LINKS.keys()];

const PAGES = navigation
  .filter((item) => item.href !== '/')
  .map((item) => ({ slug: item.href.replaceAll('/', ''), href: item.href }));

export const COMMANDS: readonly string[] = [
  'help',
  'whoami',
  'about',
  'ls',
  'experience',
  'skills',
  'contact',
  ...LINK_NAMES.map((key) => `open ${key}`),
  ...PAGES.map((page) => `cd ${page.slug}`),
  'clear',
  'exit',
];

export const DEFAULT_SUGGESTIONS: readonly string[] = [
  'help',
  'whoami',
  'experience',
  'skills',
  'contact',
  'open github',
  'exit',
];

export const BOOT_SEQUENCE: readonly Line[] = [
  { text: '$ dotnet run --project Scott.Portfolio', tone: 'command' },
  { text: '  Determining projects to restore...', tone: 'muted' },
  { text: '  All projects are up-to-date for restore.', tone: 'muted' },
  { text: '  Scott.Portfolio -> /bin/Release/net10.0/Scott.Portfolio.dll', tone: 'muted' },
  { text: 'Build succeeded.', tone: 'success' },
  { text: '    0 Warning(s)', tone: 'muted' },
  { text: '    0 Error(s)', tone: 'muted' },
  { text: '' },
  { text: "Welcome. Type 'help' or tap a command below.", tone: 'accent' },
];

const HELP: readonly Line[] = [
  { text: 'Available commands:', tone: 'accent' },
  { text: '  whoami              who I am' },
  { text: '  about               a short summary' },
  { text: '  ls                  list sections' },
  { text: '  experience          my current role' },
  { text: '  skills              my stack' },
  { text: '  contact             how to reach me' },
  { text: `  open <${LINK_NAMES.join('|')}>` },
  { text: `  cd <${PAGES.map((page) => page.slug).join('|')}>` },
  { text: '  clear               clear the screen' },
  { text: '  exit                back to Scott.cs' },
];

const error = (text: string): CommandResult => ({ lines: [{ text, tone: 'error' }] });

type Handler = (argument: string, now: Date) => CommandResult;

const HANDLERS: ReadonlyMap<string, Handler> = new Map<string, Handler>(
  Object.entries({
    help: () => ({ lines: HELP }),

    whoami: () => ({
      lines: [{ text: profile.name, tone: 'accent' }, { text: profile.role }],
    }),

    about: () => ({ lines: [{ text: profile.summary }] }),

    ls: (argument) => {
      if (!argument) {
        return { lines: [{ text: PAGES.map((page) => page.slug).join('  '), tone: 'info' }] };
      }
      if (argument === 'skills') {
        return {
          lines: [{ text: skillGroups.map((group) => group.title).join('  '), tone: 'info' }],
        };
      }
      return error(`ls: cannot access '${argument}': No such file or directory`);
    },

    experience: (_argument, now) => ({
      lines: [
        { text: `${currentRole.title} · ${currentRole.company}`, tone: 'accent' },
        {
          text: `${formatYearMonth(currentRole.startDate)} – Present (${formatTenure(currentRole.startDate, now)})`,
          tone: 'muted',
        },
        { text: currentRole.team, tone: 'muted' },
        ...currentRole.highlights.map((highlight) => ({ text: `• ${highlight}` })),
      ],
    }),

    skills: () => ({
      lines: skillGroups.map((group) => ({ text: `${group.title}: ${group.items.join(', ')}` })),
    }),

    contact: () => ({
      lines: [
        { text: `email     ${profile.email}` },
        { text: `linkedin  ${profile.social.linkedin.url.replace(/^https:\/\/(www\.)?/, '')}` },
        { text: `github    ${profile.social.github.url.replace(/^https:\/\//, '')}` },
        { text: "Tip: 'open email' to send me a message.", tone: 'muted' },
      ],
    }),

    open: (argument) => {
      const url = LINKS.get(argument);
      if (!url) return error(`Usage: open <${LINK_NAMES.join('|')}>`);
      return {
        lines: [{ text: `Opening ${argument}...`, tone: 'success' }],
        effect: { type: 'open', url },
      };
    },

    cd: (argument) => {
      if (!argument || argument === '~' || argument === 'home') {
        return { lines: [{ text: 'Already home.', tone: 'muted' }] };
      }
      const page = PAGES.find((candidate) => candidate.slug === argument);
      if (!page) return error(`cd: no such directory: ${argument}`);
      return {
        lines: [{ text: `Navigating to ${page.slug}...`, tone: 'success' }],
        effect: { type: 'navigate', href: page.href },
      };
    },

    clear: () => ({ lines: [], effect: { type: 'clear' } }),

    exit: () => ({ lines: [], effect: { type: 'exit' } }),
  } satisfies Record<string, Handler>),
);

/** Pure command interpreter: no DOM access, so it is trivially unit-testable. */
export function runCommand(input: string, now: Date = new Date()): CommandResult {
  const [name = '', ...rest] = input.trim().toLowerCase().split(/\s+/);
  if (!name) return { lines: [] };
  const handler = HANDLERS.get(name);
  if (!handler) return error(`${name}: command not found. Try 'help'.`);
  return handler(rest.join(' '), now);
}

/** Completes `partial` to the longest prefix shared by every matching command. */
export function complete(partial: string): string {
  const value = partial.trimStart().toLowerCase();
  if (!value) return partial;
  const matches = COMMANDS.filter((command) => command.startsWith(value));
  const [first] = matches;
  if (first === undefined) return partial;
  let prefix = first;
  for (const match of matches) {
    while (!match.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

export function suggest(partial: string, limit = 6): readonly string[] {
  const value = partial.trim().toLowerCase();
  if (!value) return DEFAULT_SUGGESTIONS;
  const matches = COMMANDS.filter((command) => command.startsWith(value) && command !== value);
  return matches.length > 0 ? matches.slice(0, limit) : DEFAULT_SUGGESTIONS;
}
