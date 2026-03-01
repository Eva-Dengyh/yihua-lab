import Link from "next/link";

export default function TagCloud({ tags, lang }) {
  return (
    <div className="my-3 pt-8">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/${lang}/tags/${encodeURIComponent(tag.name)}`}
          className="inline-block relative mx-3 my-1 transition-transform duration-300 hover:scale-110 hover:text-[--link-hover]"
        >
          {tag.name}
          <small className="mx-1 text-[--text-secondary]">({tag.count})</small>
        </Link>
      ))}
    </div>
  );
}
