"use client";

import { useEffect, useRef, useState } from "react";

function RevealCard({ children, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function ProjectList({ projects }) {
  return (
    <div className="mt-6 space-y-5">
      {projects.map((project, i) => (
        <RevealCard key={project.id} index={i}>
          <article className="group bg-[--card-bg] border border-[--border] rounded-xl p-5 transition-all duration-400 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[--accent]/30">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* 媒体缩略图 */}
              {project.media_url && (
                <div className="sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                  {project.media_type === "video" ? (
                    <video
                      src={project.media_url}
                      className="w-full h-32 object-cover transition-transform duration-600 group-hover:scale-[1.03]"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.media_url}
                      alt={project.localizedName}
                      className="w-full h-32 object-cover transition-transform duration-600 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
              )}

              {/* 项目信息 */}
              <div className="flex-1">
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[--accent] transition-colors duration-300 inline-flex items-center gap-1.5"
                  >
                    {project.localizedName}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-40 group-hover:opacity-70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <path d="M3.5 1.5H10.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </h3>

                {project.descriptionHtml && (
                  <div
                    className="post-content text-sm mt-1 text-[--text-secondary]"
                    dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
                  />
                )}

                {project.tech_stack && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech_stack.split(",").map((tech) => (
                      <span
                        key={tech.trim()}
                        className="px-2.5 py-0.5 text-xs rounded-full border border-[--border] text-[--text-secondary] transition-all duration-300 hover:border-[--accent]/40 hover:text-[--accent] hover:bg-[--accent-soft]"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        </RevealCard>
      ))}
    </div>
  );
}
