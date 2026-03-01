import { getAllPosts } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import ArchiveList from "@/components/ArchiveList";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.common.archives };
}

export default async function ArchivesPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const posts = await getAllPosts();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <ArchiveList posts={posts} lang={lang} dict={dict} />
    </div>
  );
}
