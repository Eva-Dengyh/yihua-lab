"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n-config";

const LANG_LABELS = {
  zh: "中",
  en: "EN",
};

export default function LangSwitch({ lang }) {
  const pathname = usePathname();

  const targetLang = locales.find((l) => l !== lang) || locales[0];
  const targetPath = pathname.replace(`/${lang}`, `/${targetLang}`);

  return (
    <Link
      href={targetPath}
      className="px-2 py-0.5 text-xs border border-[--border] rounded-md text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/40 transition-all duration-300"
      title={targetLang === "zh" ? "切换到中文" : "Switch to English"}
    >
      {LANG_LABELS[targetLang]}
    </Link>
  );
}
