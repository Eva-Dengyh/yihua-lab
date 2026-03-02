import Link from "next/link";

export default function PostNav({ prev, next, lang }) {
  return (
    <section className="post-nav py-4 overflow-hidden">
      {prev && (
        <Link
          href={`/${lang}/posts/${encodeURIComponent(prev.slug)}`}
          className="float-left font-semibold text-base transition-transform duration-300 hover:-translate-x-1"
        >
          <span className="mr-2 font-bold">&lt;</span>
          {prev.title}
        </Link>
      )}
      {next && (
        <Link
          href={`/${lang}/posts/${encodeURIComponent(next.slug)}`}
          className="float-right font-semibold text-base transition-transform duration-300 hover:translate-x-1"
        >
          {next.title}
          <span className="ml-2 font-bold">&gt;</span>
        </Link>
      )}
    </section>
  );
}
