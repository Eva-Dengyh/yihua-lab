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
          <h3 className="text-xl font-semibold mt-6 mb-2">{year}</h3>
          {grouped[year].map((post) => (
            <article key={post.slug} className="ml-8 py-1">
              <Link
                href={`/${lang}/posts/${post.slug}`}
                className="inline-block no-underline whitespace-nowrap overflow-hidden hover:text-[--link-hover] hover:bg-transparent transition-colors"
              >
                {post.title}
              </Link>
              <span className="float-right text-right text-[--text-secondary] hidden sm:inline">
                {formatDate(post.date, dict.months)}
              </span>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
