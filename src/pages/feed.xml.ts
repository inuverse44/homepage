import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((p) => p.data.draft !== true && p.data.lang === 'ja')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Blog Feed',
    description: 'Latest posts',
    site: context.site!,
    items: posts.map((p) => ({
      // Use a relative link so it joins correctly with `site` including base path
      link: `blog/${p.slug.split('/').pop()}/`,
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.date),
    }))
  });
}
