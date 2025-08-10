import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://example.com', // TODO: set real domain
  integrations: [react(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'nord' },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
