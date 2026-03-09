import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { getDictionary } from "@/lib/dictionaries";
import PostNav from "@/components/PostNav";
import TableOfContents from "@/components/TableOfContents";
import CodeHighlight from "@/components/CodeHighlight";
import ReadingProgress from "@/components/ReadingProgress";
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

function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, "");
  const cjkCount = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const wordCount = text.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((cjkCount / 400) + (wordCount / 250)));
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const dict = await getDictionary(lang);
  const post = await getPostBySlug(decodedSlug, lang);
  const { prev, next } = await getAdjacentPosts(decodedSlug, lang);
  const readTime = estimateReadTime(post.content);

  return (
    <div className="px-4 flex-1 flex flex-col">
      <ReadingProgress />
      {siteConfig.post_toc_enable && <TableOfContents dict={dict} />}

      <article className="post-wrap relative w-full max-w-[780px] mx-auto pt-8 sm:pt-12 flex-1">
        {/* 文章头部 */}
        <header className="post-header mb-2">
          {/* 分类标签 - 带入场动画 */}
          {post.categories.length > 0 && siteConfig.post_category_enable && (
            <div
              className="flex flex-wrap gap-2 mb-6"
              style={{ animation: "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both" }}
            >
              {post.categories.map((cat) => (
                <a
                  key={cat}
                  href={`/${lang}/categories/${encodeURIComponent(cat)}`}
                  className="inline-flex items-center px-3.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-[--accent] bg-[--accent-soft] rounded-full hover:bg-[--accent]/15 transition-all duration-300 hover:shadow-[0_2px_8px_rgba(200,121,65,0.15)]"
                >
                  {cat}
                </a>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h1
            className="post-title text-[2rem] sm:text-[2.8rem] leading-[1.15] font-bold tracking-tight"
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              letterSpacing: "-0.03em",
              animation: "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
            }}
          >
            {post.title}
          </h1>

          {/* 文章元信息 */}
          {siteConfig.post_meta_enable && (
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[--text-secondary] mt-6"
              style={{ animation: "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both" }}
            >
              {siteConfig.post_author_enable && siteConfig.author && (
                <a href={`/${lang}`} className="inline-flex items-center gap-2 hover:text-[--accent] transition-colors duration-300 group">
                  <span className="w-6 h-6 rounded-full bg-[--accent]/10 flex items-center justify-center text-[10px] font-bold text-[--accent] group-hover:bg-[--accent]/20 transition-all duration-300 group-hover:scale-110">
                    {siteConfig.author.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium">{siteConfig.author}</span>
                </a>
              )}
              {siteConfig.post_author_enable && siteConfig.author && post.date && siteConfig.post_date_enable && (
                <span className="text-[--border] select-none">&middot;</span>
              )}
              {post.date && siteConfig.post_date_enable && (
                <span className="tabular-nums tracking-wide">
                  {formatDate(post.date, dict.months)}
                </span>
              )}
              <span className="text-[--border] select-none">&middot;</span>
              <span className="tabular-nums tracking-wide">{readTime} min read</span>
            </div>
          )}

          {/* 装饰分隔线 */}
          <div
            className="post-header-divider mt-10 mb-2"
            style={{ animation: "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both" }}
          />
        </header>

        {/* 文章正文 */}
        <div
          className="post-content"
          style={{ animation: "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <CodeHighlight />

        {/* 版权信息 */}
        {siteConfig.post_copyright_enable && (
          <section className="post-copyright">
            {siteConfig.post_copyright_author_enable && (
              <p className="my-1.5">
                <span className="font-semibold text-[--text]">{dict.post.author}</span>
                <span>{siteConfig.author}</span>
              </p>
            )}
            {siteConfig.post_copyright_permalink_enable && (
              <p className="my-1.5">
                <span className="font-semibold text-[--text]">{dict.post.permalink}</span>
                <span>
                  <a href={`/${lang}/posts/${encodeURIComponent(decodedSlug)}`}>{`/posts/${decodedSlug}`}</a>
                </span>
              </p>
            )}
            {siteConfig.post_copyright_license_enable && (
              <p className="my-1.5">
                <span className="font-semibold text-[--text]">{dict.post.license}</span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_license_text }} />
              </p>
            )}
            {siteConfig.post_copyright_slogan_enable && (
              <p className="my-1.5">
                <span className="font-semibold text-[--text]">{dict.post.slogan}</span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_slogan_text }} />
              </p>
            )}
          </section>
        )}

        {/* 文章尾部装饰 */}
        <div className="post-end-mark" />

        {/* 标签区域 */}
        <section className="post-footer-tags flex flex-wrap items-center justify-between gap-3 py-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.length > 0 &&
              post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/${lang}/tags/${encodeURIComponent(tag)}`}
                  className="post-tag inline-flex items-center px-3.5 py-1.5 text-[12px] rounded-full border border-[--border] text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/40 hover:bg-[--accent-soft] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(200,121,65,0.08)]"
                >
                  <span className="opacity-50 mr-1">#</span>{tag}
                </a>
              ))}
          </div>
          <a
            href={`/${lang}`}
            className="text-[12px] text-[--text-secondary] hover:text-[--accent] transition-all duration-300 tracking-wide group flex items-center gap-1"
          >
            {dict.post.home}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
          </a>
        </section>

        <PostNav prev={prev} next={next} lang={lang} />
      </article>
    </div>
  );
}
