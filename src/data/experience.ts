import type { YearMonth } from '@/lib/dates';

export interface Role {
  readonly title: string;
  readonly company: string;
  readonly team: string;
  readonly startDate: YearMonth;
  /** Omit for a current role. */
  readonly endDate?: YearMonth;
  readonly highlights: readonly string[];
}

export interface PressMention {
  readonly publisher: string;
  readonly publishedOn: YearMonth;
  readonly title: string;
  readonly summary: string;
  readonly url: string;
}

export const currentRole: Role = {
  title: 'Junior Software Developer',
  company: 'Czarnikow',
  team: 'Operations team: trading, logistics and finance',
  startDate: '2023-09',
  highlights: [
    'Migrated multiple APIs to .NET 10.',
    'Integrated with the AGL (Africa Global Logistics) API using Azure Service Bus to update supply chains, displaying the AGL logo on events and preventing users from modifying them.',
    "Wrote and adapted much of the invoicing code for CZ's digital physical milk pricing tool for New Zealand dairy farmers.",
    'Implemented compliance-critical vessel checks for trading and logistic workflows, integrating third-party vessel tracking APIs into existing systems.',
    'Improved scalability and performance by optimising data access and context management.',
    'Diagnosed and resolved production bugs to improve reliability and operational confidence.',
    'Delivered end-to-end features requested by product owners to improve user workflows and drive business outcomes.',
    'Removed and refactored legacy components reducing technical debt and improving long-term maintainability.',
    'Worked within a microservice-based architecture, coordinating changes to ensure backward compatibility and minimise impact on dependent services.',
    'Collaborated across teams, helping to provide actionable technical solutions from operational issues.',
    'Provided thorough tests to validate complex business logic and reduce regression risk.',
  ],
};

export const roles: readonly Role[] = [currentRole];

export const pressMentions: readonly PressMention[] = [
  {
    publisher: 'Rural News Group',
    publishedOn: '2026-07',
    title: 'Czarnikow launches digital milk pricing tool in NZ',
    summary:
      'A world-first app letting New Zealand dairy farmers fix the price of their physical milk. I wrote and adapted much of its invoicing code.',
    url: 'https://www.ruralnewsgroup.co.nz/dairy-news/dairy-general-news/czarnikow-digital-milk-pricing-tool-nz',
  },
];
