import { getAllPostSlugs, getPostData } from '../../../lib/posts';
import type { Metadata } from 'next';
import Link from 'next/link';

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
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ホームへ戻る
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
      <div className="text-gray-600 mb-4">{postData.date}</div>
      {postData.tags && (
        <div className="flex flex-wrap mb-4">
          {postData.tags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ホームへ戻る
        </Link>
      </div>
    </article>
  );
}
