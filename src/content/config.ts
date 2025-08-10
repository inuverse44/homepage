import { z, defineCollection } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['ja','en']).default('ja'),
    hero: z.string().optional(),
    draft: z.boolean().default(false),
    slugOverride: z.string().optional(),
  }),
  slug: ({ defaultSlug, data }) => {
    if (data.slugOverride && data.slugOverride.trim()) return data.slugOverride.trim();
    const parts = defaultSlug.split('/');
    return parts[parts.length - 1];
  }
});

export const collections = { posts };
