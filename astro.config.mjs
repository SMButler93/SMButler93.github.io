// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://scott-butler.co.uk',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
