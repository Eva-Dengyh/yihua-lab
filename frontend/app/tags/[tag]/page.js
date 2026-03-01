import { getAllTags, getPostsByTag } from "@/lib/posts";
import ArchiveList from "@/components/ArchiveList";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({ tag: t.name }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  return { title: `Tag: ${decodeURIComponent(tag)}` };
}

export default async function SingleTagPage({ params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;Tag&nbsp;&middot;&nbsp;{decodedTag}&nbsp;-
        </h2>
      </div>
      <ArchiveList posts={posts} />
    </div>
  );
}
