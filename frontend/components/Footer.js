import siteConfig from "@/lib/config";

export default function Footer({ dict }) {
  return (
    <footer className="h-16 w-full text-center leading-[4rem] text-sm">
      <div>
        <span>
          &copy; {new Date().getFullYear()} {siteConfig.title}. {dict.footer.rights}.
        </span>
      </div>
    </footer>
  );
}
