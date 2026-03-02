import Link from "next/link";
import siteConfig from "@/lib/config";

export default function Profile({ lang, dict }) {
  return (
    <div className="flex flex-col justify-center items-center flex-1 px-4">
      <div className="text-center">
        <div className="p-3">
          <Link href={`/${lang}/posts`}>
            <img
              src={siteConfig.avatar}
              alt="avatar"
              className="w-32 h-auto inline-block rounded-full shadow-[0_0_0_0.3618em_rgba(0,0,0,0.05)] transition-all ease-in-out duration-400 cursor-pointer hover:-translate-y-3"
            />
          </Link>
        </div>
        <div className="text-3xl font-normal mt-2">{dict.profile.nickname}</div>
        <div
          className="mt-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: dict.profile.description }}
        />
        <div className="mt-4 flex justify-center gap-3">
          {Object.entries(siteConfig.links).map(([name, href]) => {
            if (!href) return null;
            const label = dict.links?.[name] || name;
            return (
              <a
                key={name}
                href={href}
                title={label}
                className="px-1 hover:bg-transparent text-2xl hover:text-[--link-hover] transition-colors"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
