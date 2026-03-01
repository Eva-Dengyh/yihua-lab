import { getAllPageSlugs, getPageBySlug } from "@/lib/pages";
import { notFound } from "next/navigation";
import siteConfig from "@/lib/config";

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: siteConfig.title };
  return { title: `${page.title} | ${siteConfig.title}` };
}

export default async function GenericPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="px-4 flex-1 flex flex-col">
      <article className="post-wrap relative w-full max-w-[780px] mx-auto pt-8 flex-1">
        {siteConfig.page_title_enable && (
          <h2 className="text-3xl leading-relaxed font-semibold">{page.title}</h2>
        )}
        <section
          className="post-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
