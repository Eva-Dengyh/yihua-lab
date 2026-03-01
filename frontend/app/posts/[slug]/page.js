import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import PostNav from "@/components/PostNav";
import TableOfContents from "@/components/TableOfContents";
import siteConfig from "@/lib/config";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: `${post.title} | ${siteConfig.title}` };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <div className="px-4 flex-1 flex flex-col">
      {siteConfig.post_toc_enable && <TableOfContents />}

      <article className="post-wrap relative w-full max-w-[780px] mx-auto pt-8 flex-1">
        {/* 文章标题 */}
        <header>
          <h1 className="text-3xl leading-relaxed font-semibold">{post.title}</h1>
          {siteConfig.post_meta_enable && (
            <div className="text-[rgba(85,85,85,0.53)] dark:text-[--text-secondary] text-sm mt-1">
              {siteConfig.post_author_enable && siteConfig.author && (
                <span>
                  Author: <a href="/" className="text-[--post-link] hover:text-[--post-link-hover]">{siteConfig.author}</a>
                </span>
              )}
              {post.date && siteConfig.post_date_enable && (
                <span className="ml-4">
                  Date: <span>{formatDate(post.date)}&nbsp;&nbsp;{formatTime(post.date)}</span>
                </span>
              )}
              {post.categories.length > 0 && siteConfig.post_category_enable && (
                <span className="ml-4">
                  Category:{" "}
                  {post.categories.map((cat, i) => (
                    <a
                      key={cat}
                      href={`/categories/${encodeURIComponent(cat)}`}
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

        {/* 文章内容 */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 版权信息 */}
        {siteConfig.post_copyright_enable && (
          <section className="post-copyright">
            {siteConfig.post_copyright_author_enable && (
              <p className="my-1">
                <span className="font-semibold">Author: </span>
                <span>{siteConfig.author}</span>
              </p>
            )}
            {siteConfig.post_copyright_permalink_enable && (
              <p className="my-1">
                <span className="font-semibold">Permalink: </span>
                <span>
                  <a href={`/posts/${slug}`}>{`/posts/${slug}`}</a>
                </span>
              </p>
            )}
            {siteConfig.post_copyright_license_enable && (
              <p className="my-1">
                <span className="font-semibold">License: </span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_license_text }} />
              </p>
            )}
            {siteConfig.post_copyright_slogan_enable && (
              <p className="my-1">
                <span className="font-semibold">Slogan: </span>
                <span dangerouslySetInnerHTML={{ __html: siteConfig.post_copyright_slogan_text }} />
              </p>
            )}
          </section>
        )}

        {/* 标签 */}
        <section className="flex justify-between py-4">
          <div>
            <span>Tag(s): </span>
            {post.tags.length > 0 ? (
              post.tags.map((tag, i) => (
                <span key={tag}>
                  <a href={`/tags/${encodeURIComponent(tag)}`} className="text-[--post-link] hover:text-[--post-link-hover]">
                    # {tag}
                  </a>
                  {i < post.tags.length - 1 ? " / " : ""}
                </span>
              ))
            ) : null}
          </div>
          <div>
            <a href="/" className="text-[--post-link] hover:text-[--post-link-hover]">home</a>
          </div>
        </section>

        {/* 上一篇/下一篇 */}
        <PostNav prev={prev} next={next} />
      </article>
    </div>
  );
}
