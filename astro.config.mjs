import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.green-fix.com',
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limit: 4096,
      },
    },
  },
  integrations: [sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
