import { getPageBySlug } from "@/lib/pages";
import { getDictionary } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import siteConfig from "@/lib/config";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: `${dict.nav.about} | ${siteConfig.title}` };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = await getPageBySlug("about", lang);
  if (!page) notFound();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <article className="post-wrap relative w-full max-w-[780px] mx-auto pt-8 flex-1">
        {siteConfig.page_title_enable && (
          <h2 className="text-3xl leading-relaxed font-semibold">
            {dict.nav.about}
          </h2>
        )}
        <section
          className="post-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
