import { getSortedPostsData, getAllTags } from "@/lib/posts";
import PostFilter from "./PostFilter";

export default function Home() {
  const allPostsData = getSortedPostsData();
  const allTags = getAllTags();

  return (
    <div>
      <PostFilter posts={allPostsData} tags={allTags} />
    </div>
  );
}
