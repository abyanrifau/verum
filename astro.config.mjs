// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const SITE = process.env.SITE_URL || 'https://verum.nuit.works';

// Pages that should never appear in the sitemap (personal, per-visitor views).
const NOINDEX = ['/checkout/confirmed', '/my-routine'];

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    preact({ compat: false }),
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.replace(/\/$/, '').endsWith(p)),
    }),
  ],
  image: {
    responsiveStyles: false,
  },
  vite: {
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              // Fewer, larger chunks: every page needs the same small runtime, so ship it as two files.
              codeSplitting: {
                groups: [
                  {
                    name: 'vendor',
                    test: /node_modules[\/](preact|@preact|nanostores|@nanostores|@astrojs[\/]preact|astro[\/]dist[\/](transitions|virtual-modules|prefetch|runtime))/,
                  },
                  {
                    name: 'shared',
                    test: /src[\/](stores[\/]|islands[\/]icons|islands[\/]cart[\/]|lib[\/](money|bundle|lite)|data[\/]site)/,
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-sans',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      fallbacks: ['Courier New', 'monospace'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/geist-mono-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
