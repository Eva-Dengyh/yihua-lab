import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import PostNav from "@/components/PostNav";
import TableOfContents from "@/components/TableOfContents";
import CodeHighlight from "@/components/CodeHighlight";
import siteConfig from "@/lib/config";

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug(decodedSlug, lang);
  return { title: `${post.title} | ${siteConfig.title}` };
}

function formatDate(dateStr, months) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const dict = await getDictionary(lang);
  const post = await getPostBySlug(decodedSlug, lang);
  const { prev, next } = await getAdjacentPosts(decodedSlug, lang);

  return (
    <div className="px-4 flex-1 flex flex-col">
      {siteConfig.post_toc_enable && <TableOfContents dict={dict} />}

      <article className="post-wrap relative w-full max-w-[780px] mx-auto pt-8 flex-1">
        <header>
          <h1 className="text-3xl leading-relaxed font-semibold">{post.title}</h1>
          {siteConfig.post_meta_enable && (
            <div className="text-[rgba(85,85,85,0.53)] dark:text-[--text-secondary] text-sm mt-1">
              {siteConfig.post_author_enable && siteConfig.author && (
                <span>
                  {dict.post.author}<a href={`/${lang}`} className="text-[--post-link] hover:text-[--post-link-hover]">{siteConfig.author}</a>
                </span>
              )}
              {post.date && siteConfig.post_date_enable && (
                <span className="ml-4">
                  {dict.post.date}<span>{formatDate(post.date, dict.months)}&nbsp;&nbsp;{formatTime(post.date)}</span>
                </span>
              )}
              {post.categories.length > 0 && siteConfig.post_category_enable && (
                <span className="ml-4">
                  {dict.post.category}
                  {post.categories.map((cat, i) => (
                    <a
                      key={cat}
                      href={`/${lang}/categories/${encodeURIComponent(cat)}`}
                      className="text-[--post-link] hover:text-[--post-link-hover]"
                    >
                      {cat}{i < post.categories.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </span>
              )}
            </div>
          )}
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <CodeHighlight />

        {siteConfig.post_copyright_enable && (
          <section className="post-copyright">
            {siteConfig.post_copyright_author_enable && (
              <p className="my-1">
                <span className="font-semibold">{dict.post.author}</span>
                <span>{siteConfig.author}</span>
              </p>
            )}
            {siteConfig.post_copyright_permalink_enable && (
              <p className="my-1">
                <span className="font-semibold">{dict.post.permalink}</span>
                <span>
                  <a href={`/${lang}/posts/${encodeURIComponent(decodedSlug)}`}>{`/posts/${decodedSlug}`}</a>
                </span>
              </p>
            )}
            {siteConfig.post_copyright_license_enable && (
              <p className="my-1">
                <span className="font-semibold">{dict.post.license}</span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_license_text }} />
              </p>
            )}
            {siteConfig.post_copyright_slogan_enable && (
              <p className="my-1">
                <span className="font-semibold">{dict.post.slogan}</span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_slogan_text }} />
              </p>
            )}
          </section>
        )}

        <section className="flex justify-between py-4">
          <div>
            <span>{dict.post.tags}</span>
            {post.tags.length > 0 ? (
              post.tags.map((tag, i) => (
                <span key={tag}>
                  <a href={`/${lang}/tags/${encodeURIComponent(tag)}`} className="text-[--post-link] hover:text-[--post-link-hover]">
                    # {tag}
                  </a>
                  {i < post.tags.length - 1 ? " / " : ""}
                </span>
              ))
            ) : null}
          </div>
          <div>
            <a href={`/${lang}`} className="text-[--post-link] hover:text-[--post-link-hover]">{dict.post.home}</a>
          </div>
        </section>

        <PostNav prev={prev} next={next} lang={lang} />
      </article>
    </div>
  );
}
