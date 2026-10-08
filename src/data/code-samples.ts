import { profile } from './profile';
import { practices, skillGroups } from './skills';

const quote = (value: string): string => `"${value}"`;

export const heroSnippet = `var scott = new Engineer
{
    Name = ${quote(profile.name)},
    Role = ${quote(profile.role)},
    Focus = ["Backend APIs", "Microservices"],
    Practices = ["DDD", "Clean Architecture"]
};

await scott.BuildAsync(scalable: true, resilient: true);
// Build succeeded. Ready for production.`;

/** The skills page's `Program.cs` view, generated from the same data as the cards. */
export const skillsSnippet = [
  'var builder = WebApplication.CreateBuilder(args);',
  '',
  'builder.Services',
  ...skillGroups.map((group, index) => {
    const terminator = index === skillGroups.length - 1 ? ';' : '';
    return `    .${group.registration}(${group.items.map(quote).join(', ')})${terminator}`;
  }),
  '',
  'var app = builder.Build();',
  'app.Run();',
].join('\n');

export const focusAreas = {
  title: 'Backend APIs and microservices',
  description: `${practices.items[1]}, ${practices.items[2]} and well-tested business logic.`,
} as const;
