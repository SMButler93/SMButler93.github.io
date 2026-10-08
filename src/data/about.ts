export interface Value {
  readonly title: string;
  readonly description: string;
}

export const values: readonly Value[] = [
  {
    title: 'Performance',
    description: 'Optimising data access and context management so systems scale.',
  },
  {
    title: 'Reliability',
    description: 'Diagnosing production issues and building operational confidence.',
  },
  {
    title: 'Maintainability',
    description: 'Refactoring legacy code and paying down technical debt.',
  },
  {
    title: 'Confidence',
    description: 'Thorough tests that validate complex business logic and reduce regression risk.',
  },
];
