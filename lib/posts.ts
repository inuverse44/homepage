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

export function getSortedPostsData() {
  // /posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // id を取得するためにファイル名から「.md」を削除する
    const slug = fileName.replace(/\.md$/, '');

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter を使って投稿のメタデータ部分を解析する
    const matterResult = matter(fileContents);

    // データを id と合わせる
    return {
      slug,
      ...(matterResult.data as { title: string; date: string; tags?: string[] }),
    };
  });
  // 投稿を日付でソートする
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllTags() {
  const allPosts = getSortedPostsData();
  const tags = new Set<string>();
  allPosts.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
}


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
    ...(matterResult.data as { title: string; date: string; tags: string[] }),
  };
}