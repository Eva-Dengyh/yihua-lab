import Link from "next/link";

export default function CategoryCard({ category }) {
  const { name, posts } = category;
  const displayPosts = posts.slice(0, 5);

  return (
    <div className="w-full sm:w-[45%] text-left text-sm mt-8 px-[2%] min-h-[16em]">
      <Link href={`/categories/${encodeURIComponent(name)}`}>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
      </Link>
      {displayPosts.map((post) => (
        <article key={post.slug} className="py-0.5">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-[--link-hover] hover:bg-transparent transition-colors"
          >
            {post.title}
          </Link>
        </article>
      ))}
      {posts.length > 5 && (
        <Link
          href={`/categories/${encodeURIComponent(name)}`}
          className="text-sm mt-2 inline-block hover:text-[--link-hover]"
        >
          More &gt;&gt;
        </Link>
      )}
    </div>
  );
}
