import Link from "next/link";

export default function PostNav({ prev, next, lang }) {
  if (!prev && !next) return null;

  return (
    <section className="py-6 mt-2 border-t border-[--border]">
      <div className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/${lang}/posts/${encodeURIComponent(prev.slug)}`}
            className="group flex-1 min-w-0"
          >
            <span className="text-[10px] tracking-widest uppercase text-[--text-secondary] block mb-1">Prev</span>
            <span className="text-sm font-medium transition-colors duration-300 group-hover:text-[--accent] flex items-center gap-1.5">
              <span className="transition-transform duration-300 group-hover:-translate-x-1 inline-block">&larr;</span>
              <span className="truncate">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next && (
          <Link
            href={`/${lang}/posts/${encodeURIComponent(next.slug)}`}
            className="group flex-1 min-w-0 text-right"
          >
            <span className="text-[10px] tracking-widest uppercase text-[--text-secondary] block mb-1">Next</span>
            <span className="text-sm font-medium transition-colors duration-300 group-hover:text-[--accent] flex items-center justify-end gap-1.5">
              <span className="truncate">{next.title}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">&rarr;</span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
