import Link from "next/link";

export default function CategoryCard({ category, lang, dict }) {
  const { name, posts } = category;
  const displayPosts = posts.slice(0, 5);

  return (
    <div className="w-full sm:w-[45%] text-left text-sm mt-8 px-[2%] min-h-[16em]">
      <Link href={`/${lang}/categories/${encodeURIComponent(name)}`}>
        <h3
          className="text-lg font-semibold mb-3 transition-colors duration-300 hover:text-[--accent] inline-flex items-center gap-1.5"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          {name}
          <span className="text-sm text-[--text-secondary] font-normal">({posts.length})</span>
        </h3>
      </Link>
      {displayPosts.map((post) => (
        <article key={post.slug} className="py-0.5">
          <Link
            href={`/${lang}/posts/${encodeURIComponent(post.slug)}`}
            className="hover:text-[--accent] hover:bg-transparent transition-all duration-300 inline-block hover:translate-x-1"
          >
            {post.title}
          </Link>
        </article>
      ))}
      {posts.length > 5 && (
        <Link
          href={`/${lang}/categories/${encodeURIComponent(name)}`}
          className="text-xs mt-3 inline-flex items-center gap-1 text-[--accent] opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          {dict.common.more}
        </Link>
      )}
    </div>
  );
}
