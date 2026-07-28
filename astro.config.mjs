import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mindtecbolivia.com',
  integrations: [
    sitemap({
      // Las páginas de demostración son material interno. No deben competir
      // con las páginas de servicio ni enviarse a los buscadores.
      filter: (page) => ![
        '/ScrollStoryCardsExample/',
        '/layered-scroll-demo/',
        '/morph-scroll-story-demo/',
        '/neurotecnologia-3d/',
        '/pinned-section-demo/',
        '/prueba_stackSections/',
        '/scroll-reveal-demo/',
        '/scroll-stack-demo/',
        '/scroll-story-cards-demo/',
        '/scroll-story-demo/',
        '/scroll-story-left-demo/',
      ].some((path) => new URL(page).pathname === path),
    }),
  ],
  output: 'hybrid',
  adapter: cloudflare(),
});
