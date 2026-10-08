export interface SkillGroup {
  readonly title: string;
  /** Extension-method name used when the stack is rendered as `Program.cs`. */
  readonly registration: `Add${string}`;
  readonly items: readonly string[];
}

export const practices: SkillGroup = {
  title: 'Practices',
  registration: 'AddPractices',
  items: ['Agile', 'Domain-Driven Design', 'Clean Architecture', 'Microservices'],
};

export const skillGroups: readonly SkillGroup[] = [
  { title: 'Languages', registration: 'AddLanguages', items: ['C#', 'TypeScript'] },
  {
    title: 'Frameworks & platforms',
    registration: 'AddFrameworks',
    items: ['.NET 10 (modern & legacy)', 'ASP.NET', 'Angular'],
  },
  { title: 'Messaging', registration: 'AddMessaging', items: ['Azure Service Bus'] },
  {
    title: 'Data & persistence',
    registration: 'AddPersistence',
    items: ['SQL', 'Entity Framework', 'Dapper'],
  },
  {
    title: 'Testing & tooling',
    registration: 'AddTesting',
    items: ['NUnit', 'Moq', 'FluentValidation', 'Git'],
  },
  practices,
];

/** A short, curated subset shown on the home page. */
export const stackHighlights: readonly string[] = [
  'C#',
  '.NET 10',
  'ASP.NET',
  'Angular',
  'SQL',
  'Azure Service Bus',
];
