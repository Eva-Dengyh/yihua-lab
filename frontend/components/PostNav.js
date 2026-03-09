import Link from "next/link";

export default function PostNav({ prev, next, lang }) {
  if (!prev && !next) return null;

  return (
    <nav className="post-nav-section py-8 border-t border-[--border]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/${lang}/posts/${encodeURIComponent(prev.slug)}`}
            className="post-nav-card group relative flex flex-col gap-2 p-5 rounded-xl border border-[--border] hover:border-[--accent]/30 transition-all duration-400 hover:shadow-[0_4px_20px_rgba(200,121,65,0.06)]"
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-[--text-secondary] font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:-translate-x-1 opacity-60">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Prev
            </span>
            <span className="text-[14px] font-medium leading-snug transition-colors duration-300 group-hover:text-[--accent] line-clamp-2">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${lang}/posts/${encodeURIComponent(next.slug)}`}
            className="post-nav-card group relative flex flex-col items-end gap-2 p-5 rounded-xl border border-[--border] hover:border-[--accent]/30 text-right transition-all duration-400 hover:shadow-[0_4px_20px_rgba(200,121,65,0.06)]"
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-[--text-secondary] font-medium flex items-center gap-1.5">
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1 opacity-60">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-[14px] font-medium leading-snug transition-colors duration-300 group-hover:text-[--accent] line-clamp-2">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
