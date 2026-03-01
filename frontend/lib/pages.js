import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { defaultLocale } from "@/i18n-config";

const PAGES_DIR = path.join(process.cwd(), "content/pages");

export async function getPageBySlug(slug, lang = defaultLocale) {
  // 优先查找语言特定文件（如 about.zh.md），回退到通用文件（about.md）
  const langFile = path.join(PAGES_DIR, `${slug}.${lang}.md`);
  const defaultFile = path.join(PAGES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(langFile) ? langFile : defaultFile;

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title || slug,
    content: marked(content),
  };
}
