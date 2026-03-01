import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "content", "posts");

function getMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      categories: data.categories
        ? Array.isArray(data.categories) ? data.categories : [data.categories]
        : [],
      tags: data.tags
        ? Array.isArray(data.tags) ? data.tags : [data.tags]
        : [],
      mathjax: data.mathjax || false,
    };
  });
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processor = getMarkdownProcessor();
  const result = await processor.process(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    categories: data.categories
      ? Array.isArray(data.categories) ? data.categories : [data.categories]
      : [],
    tags: data.tags
      ? Array.isArray(data.tags) ? data.tags : [data.tags]
      : [],
    content: result.toString(),
    mathjax: data.mathjax || false,
  };
}

export function getAdjacentPosts(slug) {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? { slug: posts[index - 1].slug, title: posts[index - 1].title } : null,
    next: index < posts.length - 1 ? { slug: posts[index + 1].slug, title: posts[index + 1].title } : null,
  };
}

export function getAllTags() {
  const posts = getAllPosts();
  const tagMap = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagMap[tag]) tagMap[tag] = 0;
      tagMap[tag]++;
    });
  });
  return Object.entries(tagMap).map(([name, count]) => ({ name, count }));
}

export function getAllCategories() {
  const posts = getAllPosts();
  const catMap = {};
  posts.forEach((post) => {
    post.categories.forEach((cat) => {
      if (!catMap[cat]) catMap[cat] = [];
      catMap[cat].push(post);
    });
  });
  return Object.entries(catMap).map(([name, posts]) => ({ name, posts }));
}

export function getPostsByTag(tag) {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getPostsByCategory(category) {
  return getAllPosts().filter((p) => p.categories.includes(category));
}
