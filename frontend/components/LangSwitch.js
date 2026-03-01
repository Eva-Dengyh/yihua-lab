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

  // 将当前路径中的语言前缀替换为目标语言
  const targetLang = locales.find((l) => l !== lang) || locales[0];
  const targetPath = pathname.replace(`/${lang}`, `/${targetLang}`);

  return (
    <Link
      href={targetPath}
      className="ml-3 px-2 py-0.5 text-sm border border-[--border] rounded hover:text-[--link-hover] hover:border-[--link-hover] transition-colors"
      title={targetLang === "zh" ? "切换到中文" : "Switch to English"}
    >
      {LANG_LABELS[targetLang]}
    </Link>
  );
}
