import { useState, useEffect } from "react";

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

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  page_type: string;
  excerpt: string | null;
  cover_image: string | null;
  published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type AuthStatus = {
  authenticated: boolean;
  handle?: string;
};

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "pages" | "images">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => {
        setAuthStatus(data);
        setLoading(false);
      });
  }, []);

  // Fetch projects
  useEffect(() => {
    if (authStatus?.authenticated) {
      fetch("/api/projects?admin=true")
        .then((r) => r.json())
        .then(setProjects);
      fetch("/api/pages?admin=true")
        .then((r) => r.json())
        .then(setPages);
    }
  }, [authStatus?.authenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="text-white font-poppins text-2xl">loading...</div>
      </div>
    );
  }

  if (!authStatus?.authenticated) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center gap-6">
        <div className="text-white font-poppins text-4xl">admin</div>
        <p className="text-[#878787] font-poppins text-xl">sign in with your Ave identity to access the admin panel</p>
        <a
          href="/api/auth/login"
          className="px-8 py-3 bg-[#714DD7] text-white font-poppins text-xl hover:bg-[#6041BA] transition"
        >
          sign in with Ave
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">admin dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-[#878787]">logged in as {authStatus.handle || "admin"}</span>
            <button
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST" }).then(() => {
                  window.location.reload();
                });
              }}
              className="px-4 py-2 bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] transition"
            >
              logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["projects", "pages", "images"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-poppins text-lg transition ${activeTab === tab ? "bg-[#714DD7] text-white" : "bg-[#1A1A1A] text-[#878787] hover:bg-[#2A2A2A] hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            setProjects={setProjects}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        )}
        {activeTab === "pages" && (
          <PagesTab
            pages={pages}
            setPages={setPages}
            editingPage={editingPage}
            setEditingPage={setEditingPage}
          />
        )}
        {activeTab === "images" && <ImagesTab />}
      </div>
    </div>
  );
}

// Projects Tab Component
function ProjectsTab({
  projects,
  setProjects,
  editingProject,
  setEditingProject,
}: {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  editingProject: Project | null;
  setEditingProject: (p: Project | null) => void;
}) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    slug: "",
    url: "",
    description: "",
    long_description: "",
    color: "#714DD7",
    status: "active",
    screenshots: [],
    technologies: [],
    featured: 0,
    sort_order: 0,
  });

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    } else {
      setFormData({
        name: "",
        slug: "",
        url: "",
        description: "",
        long_description: "",
        color: "#714DD7",
        status: "active",
        screenshots: [],
        technologies: [],
        featured: 0,
        sort_order: 0,
      });
    }
  }, [editingProject]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      // Update existing project
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...formData } as Project : p)));
        setEditingProject(null);
      }
    } else {
      // Create new project
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects([...projects, newProject]);
        setFormData({
          name: "",
          slug: "",
          url: "",
          description: "",
          long_description: "",
          color: "#714DD7",
          status: "active",
          screenshots: [],
          technologies: [],
          featured: 0,
          sort_order: 0,
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-[#121212] p-6">
        <h2 className="text-2xl font-poppins mb-6 text-[#d3d3d3]">{editingProject ? "edit project" : "new project"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">name *</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({ ...formData, name, slug: generateSlug(name) });
              }}
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">slug *</label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">url</label>
            <input
              type="url"
              value={formData.url || ""}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">description *</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors h-24 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">long description</label>
            <textarea
              value={formData.long_description || ""}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors h-32 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#878787] mb-1 font-poppins text-sm">color</label>
              <input
                type="color"
                value={formData.color || "#714DD7"}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-12 bg-[#1A1A1A] cursor-pointer border border-[#2A2A2A]"
              />
            </div>
            <div>
              <label className="block text-[#878787] mb-1 font-poppins text-sm">status</label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors"
              >
                <option value="active">active</option>
                <option value="wip">wip</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[#878787] mb-1 font-poppins text-sm">technologies (comma or newline separated)</label>
            <textarea
              value={formData.technologies?.join("\n") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technologies: e.target.value.split(/[,\n]/).map((t) => t.trim()).filter(Boolean),
                })
              }
              className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors h-24 resize-none"
              placeholder="React\nTypeScript\nNode.js"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#878787] mb-1 font-poppins text-sm">sort order</label>
              <input
                type="number"
                value={formData.sort_order || 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="w-full bg-[#1A1A1A] px-4 py-3 text-white font-poppins border border-[#2A2A2A] focus:border-[#714DD7] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={formData.featured ? true : false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                className="w-5 h-5"
              />
              <label>featured</label>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="flex-1 py-3 bg-[#714DD7] hover:bg-[#6041BA] transition font-poppins text-white">
              {editingProject ? "update" : "create"}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] transition font-poppins text-white"
              >
                cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-[#121212] p-6">
        <h2 className="text-2xl font-poppins mb-6 text-[#d3d3d3]">projects ({projects.length})</h2>
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#1A1A1A] p-4 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: project.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{project.name}</span>
                    {project.status === "wip" && (
                      <span className="text-xs bg-[#2A2A2A] px-2 py-0.5 rounded">wip</span>
                    )}
                    {project.featured === 1 && (
                      <span className="text-xs bg-[#714DD7] px-2 py-0.5 rounded">featured</span>
                    )}
                  </div>
                  <p className="text-[#878787] text-sm mt-1 line-clamp-2">{project.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="px-3 py-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-sm"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1 bg-[#FF4444] hover:bg-[#CC0000] text-sm"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pages Tab Component
function PagesTab({
  pages,
  setPages,
  editingPage,
  setEditingPage,
}: {
  pages: Page[];
  setPages: (p: Page[]) => void;
  editingPage: Page | null;
  setEditingPage: (p: Page | null) => void;
}) {
  const [formData, setFormData] = useState<Partial<Page>>({
    title: "",
    slug: "",
    content: "",
    page_type: "page",
    excerpt: "",
    cover_image: "",
    published: 0,
  });

  useEffect(() => {
    if (editingPage) {
      setFormData(editingPage);
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        page_type: "page",
        excerpt: "",
        cover_image: "",
        published: 0,
      });
    }
  }, [editingPage]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      const res = await fetch(`/api/pages/${editingPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setPages(pages.map((p) => (p.id === editingPage.id ? { ...p, ...formData } as Page : p)));
        setEditingPage(null);
      }
    } else {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newPage = await res.json();
        setPages([...pages, newPage]);
        setFormData({
          title: "",
          slug: "",
          content: "",
          page_type: "page",
          excerpt: "",
          cover_image: "",
          published: 0,
        });
      }
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    
    const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setPages(pages.filter((p) => p.slug !== slug));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-[#121212] p-6">
        <h2 className="text-2xl mb-4">{editingPage ? "edit page" : "new page"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#878787] mb-1">title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ ...formData, title, slug: generateSlug(title) });
              }}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1">slug *</label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1">type</label>
            <select
              value={formData.page_type || "page"}
              onChange={(e) => setFormData({ ...formData, page_type: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white"
            >
              <option value="page">page</option>
              <option value="blog">blog post</option>
              <option value="project-detail">project detail</option>
            </select>
          </div>
          <div>
            <label className="block text-[#878787] mb-1">excerpt</label>
            <textarea
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white h-20"
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1">content (markdown) *</label>
            <textarea
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white h-48 font-mono text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[#878787] mb-1">cover image url</label>
            <input
              type="text"
              value={formData.cover_image || ""}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full bg-[#1A1A1A] px-4 py-2 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published ? true : false}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
              className="w-5 h-5"
            />
            <label>published</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 py-2 bg-[#714DD7] hover:bg-[#6041BA] transition">
              {editingPage ? "update" : "create"}
            </button>
            {editingPage && (
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="flex-1 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] transition"
              >
                cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-[#121212] p-6">
        <h2 className="text-2xl mb-4">pages ({pages.length})</h2>
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {pages.map((page) => (
            <div key={page.id} className="bg-[#1A1A1A] p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{page.title}</span>
                  {page.published ? (
                    <span className="text-xs bg-[#0DCB7D] text-black px-2 py-0.5 rounded">published</span>
                  ) : (
                    <span className="text-xs bg-[#2A2A2A] px-2 py-0.5 rounded">draft</span>
                  )}
                  <span className="text-xs text-[#878787]">{page.page_type}</span>
                </div>
                <p className="text-[#878787] text-sm mt-1">/{page.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPage(page)}
                  className="px-3 py-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-sm"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDelete(page.slug)}
                  className="px-3 py-1 bg-[#FF4444] hover:bg-[#CC0000] text-sm"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Images Tab Component
function ImagesTab() {
  const [images, setImages] = useState<{ key: string; url: string; size: number; uploaded: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then(setImages);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/images", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newImage = await res.json();
      setImages([...images, newImage]);
    }
    setUploading(false);
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    const res = await fetch(`/api/images/${encodeURIComponent(key)}`, { method: "DELETE" });
    if (res.ok) {
      setImages(images.filter((i) => i.key !== key));
    }
  };

  const copyUrl = (key: string) => {
    navigator.clipboard.writeText(`/api/images/${key}`);
  };

  return (
    <div>
      <div className="bg-[#121212] p-6 mb-8">
        <h2 className="text-2xl mb-4">upload image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="text-white"
        />
        {uploading && <p className="text-[#878787] mt-2">uploading...</p>}
      </div>

      <div className="bg-[#121212] p-6">
        <h2 className="text-2xl mb-4">images ({images.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.key} className="bg-[#1A1A1A] p-4">
              <img
                src={image.url}
                alt={image.key}
                className="w-full h-32 object-cover mb-2"
              />
              <p className="text-sm text-[#878787] truncate">{image.key}</p>
              <p className="text-xs text-[#878787]">{Math.round(image.size / 1024)} KB</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => copyUrl(image.key)}
                  className="flex-1 px-2 py-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-xs"
                >
                  copy url
                </button>
                <button
                  onClick={() => handleDelete(image.key)}
                  className="px-2 py-1 bg-[#FF4444] hover:bg-[#CC0000] text-xs"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
