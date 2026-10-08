# scott-butler.co.uk

The personal portfolio of **Scott Butler**, Full-Stack .NET Engineer.

A fast, static, mobile-first site built with [Astro](https://astro.build) and TypeScript, deployed to GitHub Pages. It ships almost no JavaScript: pages are pre-rendered HTML and CSS, with small, progressively-enhanced scripts for the interactive parts.

## Features

- **Five pages**: Home, About, Experience, Skills and Contact, plus a custom 404.
- **Glassmorphic design system** built on CSS custom properties and `oklch` colour.
- **Interactive hero console**: a typed C# snippet that turns into a working shell when you hit `▶ dotnet run`. Try `help`, `whoami`, `experience`, `skills`, `contact`, `open github` or `cd skills`. Supports Tab completion, command history (↑/↓), tappable suggestions and Esc to exit.
- **Single source of truth** for content in `src/data`. The skills cards, the `Program.cs` view and the terminal output are all generated from the same data.
- **Build-time syntax highlighting**, so no highlighter ships to the browser.
- **Accessible by default**: semantic landmarks, skip link, visible focus states, WAI-ARIA tabs, live regions, `prefers-reduced-motion` support and keyboard-operable everything.
- **Progressive enhancement**: every page works without JavaScript. Controls that need JS stay hidden until they can work.
- **SEO**: canonical URLs, Open Graph tags, `schema.org/Person` structured data, sitemap and robots.txt.
- **Optimised images** via `astro:assets` (responsive WebP, explicit dimensions, no layout shift).
- **Self-hosted fonts** via Fontsource (no third-party requests).

## Tech stack

| Concern    | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Astro 5 (static output)                             |
| Language   | TypeScript (strict)                                 |
| Styling    | Scoped component CSS + global design tokens         |
| Fonts      | Bricolage Grotesque, Geist, Geist Mono (Fontsource) |
| Testing    | Vitest                                              |
| Formatting | Prettier + `prettier-plugin-astro`, EditorConfig    |
| CI/CD      | GitHub Actions → GitHub Pages                       |

## Getting started

Requires Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
```

### Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server                      |
| `npm run build`   | Build the static site into `dist/`        |
| `npm run preview` | Serve the production build locally        |
| `npm run check`   | Type-check `.astro` and `.ts` files       |
| `npm test`        | Run unit tests                            |
| `npm run format`  | Format the codebase with Prettier         |
| `npm run verify`  | Type-check, test and build (what CI runs) |

## Project structure

```text
├── .github/workflows/deploy.yml  # CI: check, test, build, deploy
├── public/                       # Copied as-is (CNAME, favicon, robots.txt)
└── src/
    ├── assets/                   # Images processed by astro:assets
    ├── components/               # Reusable UI (GlassCard, WindowFrame, HeroConsole, …)
    ├── data/                     # All site content, typed
    ├── layouts/BaseLayout.astro  # <head>, header, footer, global styles
    ├── lib/                      # Pure, tested utilities (dates, C# tokenizer)
    ├── pages/                    # One file per route
    ├── scripts/                  # Client-side enhancements
    │   └── terminal/             # Command interpreter (pure) + DOM controller
    └── styles/global.css         # Design tokens, base styles, shared utilities
```

## Editing content

All copy lives in `src/data`. You shouldn't need to touch components to update the site.

- `profile.ts`: name, role, headline, summary, email, social links
- `experience.ts`: roles, highlights, press mentions
- `skills.ts`: skill groups (also drives `Program.cs` and the terminal)
- `about.ts`: the "What I care about" cards
- `code-samples.ts`: the hero snippet

Durations such as "3 yrs 2 mos" are calculated from `startDate`. They're rendered at build time and refreshed in the browser, so they stay current between deploys.

To add a terminal command, add a handler to `src/scripts/terminal/commands.ts`, list it in `COMMANDS` and cover it in `commands.test.ts`.

## Deployment

Pushing to `main` runs the workflow in `.github/workflows/deploy.yml`, which type-checks, tests, builds and deploys to GitHub Pages. Pull requests run the same checks without deploying.

One-time setup:

1. Run `npm install` and commit the generated `package-lock.json` (CI uses `npm ci`).
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The custom domain is configured by `public/CNAME` (`scott-butler.co.uk`).

## License

Source code is available for reference. The written content and photography are © Scott Butler and may not be reused without permission.
