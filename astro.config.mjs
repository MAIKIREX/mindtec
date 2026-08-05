import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mindtecbolivia.com',
  integrations: [sitemap()],
  output: 'hybrid',
  adapter: cloudflare(),
});
