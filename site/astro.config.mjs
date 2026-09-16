// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` feeds canonical, hreflang, og:image and sitemap URLs. Change it if the site ever moves domain.
export default defineConfig({
  site: 'https://maisoneniola.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-GB', es: 'es-ES' } } })],
});
