import { getPostsByCategory } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import ArchiveList from "@/components/ArchiveList";

export async function generateMetadata({ params }) {
  const { lang, category } = await params;
  const dict = await getDictionary(lang);
  return { title: `${dict.common.category}: ${decodeURIComponent(category)}` };
}

export default async function SingleCategoryPage({ params }) {
  const { lang, category } = await params;
  const dict = await getDictionary(lang);
  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory);

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;{dict.common.categories}&nbsp;&middot;&nbsp;{decodedCategory}&nbsp;-
        </h2>
      </div>
      <ArchiveList posts={posts} lang={lang} dict={dict} />
    </div>
  );
}
