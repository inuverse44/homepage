import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Use env-provided values during CI (GitHub Pages) and fall back locally.
  site: process.env.SITE_URL ?? 'https://example.com',
  base: process.env.BASE_PATH ?? '/',
  integrations: [react(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'nord' },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
