import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 新しいライブラリのインポート
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'contents');

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.md$/, ''),
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  // ★修正: 最新のunifiedを使った処理パイプライン
  const file = await unified()
    .use(remarkParse) // 1. Markdownを解析
    .use(remarkMath)  // 2. 数式構文を認識
    .use(remarkRehype, { allowDangerousHtml: true }) // 3. HTMLのASTに変換（KaTeXが生成するHTMLを許可）
    .use(rehypeKatex) // 4. 数式をKaTeXでレンダリング
    .use(rehypeStringify) // 5. HTMLを文字列に変換
    .process(matterResult.content);

  const contentHtml = String(file);

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { title: string; date: string }),
  };
}