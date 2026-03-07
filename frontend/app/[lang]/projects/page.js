import { getDictionary } from "@/lib/dictionaries";
import { getAllProjects } from "@/lib/projects";
import { marked } from "marked";
import siteConfig from "@/lib/config";
import ProjectList from "@/components/ProjectList";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: `${dict.projects.title} | ${siteConfig.title}` };
}

function deepParse(val) {
  while (typeof val === "string") {
    try { val = JSON.parse(val); } catch { return val; }
  }
  return val;
}

function localize(field, lang) {
  if (!field) return "";
  let val = deepParse(field);
  if (typeof val === "object" && val !== null) {
    const text = val[lang] || val.zh || val.en || "";
    const parsed = deepParse(text);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed[lang] || parsed.zh || parsed.en || "";
    }
    return text;
  }
  return String(val);
}

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const projects = await getAllProjects();

  // 预处理项目数据，将 description 渲染为 HTML
  const processedProjects = projects.map((project) => ({
    ...project,
    localizedName: localize(project.name, lang),
    localizedDesc: localize(project.description, lang),
    descriptionHtml: localize(project.description, lang)
      ? marked(localize(project.description, lang))
      : "",
  }));

  return (
    <div className="px-4 flex-1 flex flex-col">
      <div className="relative w-full max-w-[780px] mx-auto pt-8 flex-1">
        {siteConfig.page_title_enable && (
          <h2 className="text-3xl leading-relaxed font-semibold">
            {dict.projects.title}
          </h2>
        )}

        {projects.length === 0 ? (
          <p className="text-[--text-secondary] mt-8">{dict.projects.noProjects}</p>
        ) : (
          <ProjectList projects={processedProjects} />
        )}
      </div>
    </div>
  );
}
