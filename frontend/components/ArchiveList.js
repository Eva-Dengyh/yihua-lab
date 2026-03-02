import Link from "next/link";

function formatDate(dateStr, months) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function ArchiveList({ posts, lang, dict }) {
  const grouped = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
      {years.map((year) => (
        <div key={year}>
          <h3 className="text-xl font-semibold mt-8 mb-3 pb-1 border-b border-[--border]">
            {year}
          </h3>
          {grouped[year].map((post) => (
            <article
              key={post.slug}
              className="ml-4 sm:ml-8 py-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0 sm:gap-4"
            >
              <Link
                href={`/${lang}/posts/${encodeURIComponent(post.slug)}`}
                className="no-underline hover:text-[--link-hover] transition-colors flex-1 min-w-0"
              >
                {post.title}
              </Link>
              <span className="text-sm text-[--text-secondary] shrink-0">
                {formatDate(post.date, dict.months)}
              </span>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
