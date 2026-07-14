import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.branda.ist',
  trailingSlash: 'always',

  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
  }),

  redirects: {
    '/iletisim.html': '/iletisim/',
    '/hakkimizda.html': '/hakkimizda/',
    '/hizmetler.html': '/hizmetler/',
    '/urunler.html': '/urunler/',
    '/kalyon-kamyonet-brandasi': '/kamyon-kamyonet-brandasi/',
  },

  build: {
    format: 'directory',
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});