import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import ArchiveList from "@/components/ArchiveList";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({ category: c.name }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  return { title: `Category: ${decodeURIComponent(category)}` };
}

export default async function SingleCategoryPage({ params }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = getPostsByCategory(decodedCategory);

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;Categories&nbsp;&middot;&nbsp;{decodedCategory}&nbsp;-
        </h2>
      </div>
      <ArchiveList posts={posts} />
    </div>
  );
}
