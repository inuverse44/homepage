import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">新着記事</h1>
      <ul>
        <li>
          <Link href="/blog/my-first-post" className="text-blue-600 hover:underline">
            私の最初の投稿
          </Link>
        </li>
      </ul>
    </div>
  );
}
