import { getPostsByTag } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import ArchiveList from "@/components/ArchiveList";

export async function generateMetadata({ params }) {
  const { lang, tag } = await params;
  const dict = await getDictionary(lang);
  return { title: `${dict.common.tag}: ${decodeURIComponent(tag)}` };
}

export default async function SingleTagPage({ params }) {
  const { lang, tag } = await params;
  const dict = await getDictionary(lang);
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag, lang);

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
        <h2 className="text-3xl leading-relaxed font-semibold text-center">
          -&nbsp;{dict.common.tag}&nbsp;&middot;&nbsp;{decodedTag}&nbsp;-
        </h2>
      </div>
      <ArchiveList posts={posts} lang={lang} dict={dict} />
    </div>
  );
}
