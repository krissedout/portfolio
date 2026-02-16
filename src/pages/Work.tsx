import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "../components/EditableBlock";

type Project = {
  id: string;
  name: string;
  slug: string;
  url: string | null;
  description: string;
  long_description: string | null;
  color: string;
  status: string;
  screenshots: string[];
  technologies: string[];
  featured: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function ProjectCard({ project, index, onExpand }: { project: Project; index: number; onExpand: (p: Project) => void }) {
  return (
    <motion.div
      className="group flex flex-col gap-2 p-6 bg-[#1A1A1A]/60 hover:bg-[#1A1A1A]/80 transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onExpand(project)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-poppins text-[24px] xl:text-[32px] font-medium group-hover:text-opacity-80 transition-all">
            {project.name}
          </span>
          {project.status === "wip" && (
            <span className="text-[#878787] text-[14px] font-poppins bg-[#2A2A2A] px-2 py-0.5 rounded">
              wip
            </span>
          )}
        </div>
        <svg
          className="w-6 h-6 text-[#878787] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M17 7H7M17 7V17"
          />
        </svg>
      </div>
      <p className="text-[#878787] font-poppins text-[16px] xl:text-[20px] leading-relaxed">
        {project.description}
      </p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[12px] font-poppins bg-[#2A2A2A] text-[#878787] px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#121212] w-full max-h-[85vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-poppins font-bold text-white">{project.name}</h2>
              {project.status === "wip" && (
                <span className="text-[#878787] text-[14px] font-poppins bg-[#2A2A2A] px-2 py-0.5 rounded">
                  wip
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#878787] hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="p-6 border-b border-[#2A2A2A]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.screenshots.map((screenshot, i) => (
                <img
                  key={i}
                  src={screenshot}
                  alt={`${project.name} screenshot ${i + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <p className="text-[#878787] font-poppins text-lg leading-relaxed mb-6">
            {project.long_description || project.description}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#d3d3d3] font-poppins text-lg mb-2">technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[14px] font-poppins bg-[#2A2A2A] text-[#878787] px-3 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Link */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#714DD7] text-white font-poppins hover:bg-[#6041BA] transition"
            >
              visit project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-[#878787] font-poppins text-xl">loading projects...</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full flex flex-col overflow-y-scroll scroll-smooth no-scrollbar">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-[#d3d3d3] text-[24px] xl:text-[48px] font-poppins leading-none">
              my work
            </span>
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <a
                  href="/admin"
                  className="px-4 py-2 text-[14px] font-poppins bg-[#1A1A1A] text-[#878787] hover:text-white hover:bg-[#2A2A2A] transition"
                >
                  edit projects
                </a>
              )}
              <a
                href="https://github.com/krissedout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#878787] hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6 xl:w-8 xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://x.com/krissedout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#878787] hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6 xl:w-8 xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          <p className="text-[#878787] font-poppins text-[16px] xl:text-[24px]">
            things i've built, broke, and sometimes fixed
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onExpand={setSelectedProject}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#878787]">
            <p className="text-xl">no projects yet...</p>
            <p className="text-sm mt-2">check back soon!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
