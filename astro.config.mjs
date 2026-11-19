// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// /tema: muestrario del tema, solo existe con `npm run dev` (no se publica).
const temaSoloDev = {
  name: 'tema-solo-dev',
  hooks: {
    /** @param {{ command: string, injectRoute: (r: { pattern: string, entrypoint: string }) => void }} o */
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') injectRoute({ pattern: '/tema', entrypoint: './src/dev/tema.astro' });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // GitHub Pages: https://conrhat.github.io/El-Chachapoyano/ (con dominio propio: cambiar site y quitar base).
  site: 'https://conrhat.github.io',
  base: '/El-Chachapoyano',
  integrations: [react(), temaSoloDev],

  vite: {
    plugins: [tailwindcss()]
  }
});
