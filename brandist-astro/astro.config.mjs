import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.branda.ist',
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },



  vite: {
    plugins: [tailwindcss()]
  }
});