import siteConfig from "@/lib/config";

export default function Footer({ dict }) {
  return (
    <footer className="w-full text-center py-6 text-xs tracking-wider text-[--text-secondary]">
      <div className="mx-auto mb-3" style={{ width: "24px", height: "1px", background: "var(--border)" }} />
      <span style={{ fontFamily: "'Crimson Pro', Georgia, serif", letterSpacing: "0.05em" }}>
        &copy; {new Date().getFullYear()} {siteConfig.title}
      </span>
      <span className="mx-1.5 opacity-30">/</span>
      <span className="opacity-60">{dict.footer.rights}</span>
    </footer>
  );
}
