import { getAllPosts } from "@/lib/posts";
import ArchiveList from "@/components/ArchiveList";

export const metadata = {
  title: "Archives",
};

export default function ArchivesPage() {
  const posts = getAllPosts();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <ArchiveList posts={posts} />
    </div>
  );
}
