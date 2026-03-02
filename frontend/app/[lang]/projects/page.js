import { getDictionary } from "@/lib/dictionaries";
import { getAllProjects } from "@/lib/projects";
import { marked } from "marked";
import siteConfig from "@/lib/config";

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
    // 提取语言值后再深度解析，防止值本身也是 JSON 字符串
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
          <div className="mt-6 space-y-5">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-[--card-bg] border border-[--border] rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 媒体缩略图 */}
                  {project.media_url && (
                    <div className="sm:w-48 flex-shrink-0">
                      {project.media_type === "video" ? (
                        <video
                          src={project.media_url}
                          className="w-full h-32 object-cover rounded-lg"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={project.media_url}
                          alt={localize(project.name, lang)}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  {/* 项目信息 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[--link-hover] transition-colors"
                      >
                        {localize(project.name, lang)}
                        <span className="inline-block ml-1 text-sm text-[--text-secondary]">↗</span>
                      </a>
                    </h3>

                    {localize(project.description, lang) && (
                      <div
                        className="post-content text-sm mt-1"
                        dangerouslySetInnerHTML={{
                          __html: marked(localize(project.description, lang)),
                        }}
                      />
                    )}

                    {project.tech_stack && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tech_stack.split(",").map((tech) => (
                          <span
                            key={tech.trim()}
                            className="px-2 py-0.5 text-xs border border-[--border] rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
