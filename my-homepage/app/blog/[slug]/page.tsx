import { getAllPostSlugs, getPostData } from '../../../lib/posts';
import type { Metadata } from 'next';

// metadata API
export async function generateMetadata({
  params,
}: {
  params: { slug: string };    // 型はそのままでもOK
}): Promise<Metadata> {
  const { slug } = await params;              // ← ここを await
  const postData = await getPostData(slug);
  return { title: postData.title };
}

// 静的パス生成は変わらず
export function generateStaticParams() {
  return getAllPostSlugs();
}

// ページコンポーネントも同様
export default async function Post({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;              // ← ここを await
  const postData = await getPostData(slug);

  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
      <div className="text-gray-600 mb-4">{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
