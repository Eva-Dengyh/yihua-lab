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
          <h1
            className="text-3xl leading-relaxed font-semibold"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif", letterSpacing: "-0.02em" }}
          >
            {post.title}
          </h1>
          {siteConfig.post_meta_enable && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[--text-secondary] mt-3 tracking-wide">
              {siteConfig.post_author_enable && siteConfig.author && (
                <span className="inline-flex items-center gap-1">
                  <span className="opacity-50">by</span>
                  <a href={`/${lang}`} className="text-[--accent] hover:text-[--post-link-hover] transition-colors">
                    {siteConfig.author}
                  </a>
                </span>
              )}
              {post.date && siteConfig.post_date_enable && (
                <span className="tabular-nums">
                  {formatDate(post.date, dict.months)}&nbsp;&nbsp;{formatTime(post.date)}
                </span>
              )}
              {post.categories.length > 0 && siteConfig.post_category_enable && (
                <span className="inline-flex items-center gap-1">
                  <span className="opacity-50">in</span>
                  {post.categories.map((cat, i) => (
                    <a
                      key={cat}
                      href={`/${lang}/categories/${encodeURIComponent(cat)}`}
                      className="text-[--accent] hover:text-[--post-link-hover] transition-colors"
                    >
                      {cat}{i < post.categories.length - 1 ? "," : ""}
                    </a>
                  ))}
                </span>
              )}
            </div>
          )}
          {/* 装饰线 */}
          <div className="mt-6 mb-2 w-10 h-px bg-[--accent] opacity-40" />
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

        {/* 标签 */}
        <section className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="flex flex-wrap gap-2">
            {post.tags.length > 0 &&
              post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/${lang}/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-2.5 py-0.5 text-xs rounded-full border border-[--border] text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/40 hover:bg-[--accent-soft] transition-all duration-300"
                >
                  # {tag}
                </a>
              ))}
          </div>
          <a
            href={`/${lang}`}
            className="text-xs text-[--text-secondary] hover:text-[--accent] transition-colors duration-300 tracking-wide"
          >
            {dict.post.home} &rarr;
          </a>
        </section>

        <PostNav prev={prev} next={next} lang={lang} />
      </article>
    </div>
  );
}
