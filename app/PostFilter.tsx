'use client';

import Link from "next/link";
import { useState } from 'react';

// Define the types for props
interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
}

interface PostFilterProps {
  posts: Post[];
  tags: string[];
}

export default function PostFilter({ posts, tags }: PostFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">タグ</h2>
        <div className="flex flex-wrap">
          <button onClick={() => setSelectedTag(null)} className={`mr-2 mb-2 px-3 py-1 rounded-full text-sm font-medium ${
            !selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}>
            すべて
          </button>
          {tags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)} className={`mr-2 mb-2 px-3 py-1 rounded-full text-sm font-medium ${
              selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">新着記事</h1>
      <ul>
        {filteredPosts.map(({ slug, title, date }) => (
          <li key={slug} className="mb-4">
            <Link href={`/blog/${slug}`} className="text-blue-600 hover:underline">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">{date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
