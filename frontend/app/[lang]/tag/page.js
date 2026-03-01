import { getAllTags } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import TagCloud from "@/components/TagCloud";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.common.tags };
}

export default async function TagPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const tags = await getAllTags();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;{dict.common.tagCloud}&nbsp;-
        </h2>
        <TagCloud tags={tags} lang={lang} />
      </div>
    </div>
  );
}
