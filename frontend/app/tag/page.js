import { getAllTags } from "@/lib/posts";
import TagCloud from "@/components/TagCloud";

export const metadata = {
  title: "Tags",
};

export default function TagPage() {
  const tags = getAllTags();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;Tag Cloud&nbsp;-
        </h2>
        <TagCloud tags={tags} />
      </div>
    </div>
  );
}
