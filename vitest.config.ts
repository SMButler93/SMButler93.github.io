/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Reuses Astro's Vite config so path aliases (`@/*`) resolve in tests.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
