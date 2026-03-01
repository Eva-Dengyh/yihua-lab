import siteConfig from "@/lib/config";

export default function Footer() {
  return (
    <footer className="h-16 w-full text-center leading-[4rem] text-sm">
      <div>
        <span>
          &copy; {siteConfig.author} | Powered by{" "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-[--link-hover]">
            Next.js
          </a>{" "}
          &amp;{" "}
          <a href="https://github.com/Siricee/hexo-theme-Chic" target="_blank" rel="noopener noreferrer" className="hover:text-[--link-hover]">
            Chic
          </a>
        </span>
      </div>
    </footer>
  );
}
