import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.branda.ist',
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});