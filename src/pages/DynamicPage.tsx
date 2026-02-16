import { useState, useEffect } from "react";
import { motion } from "motion/react";

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

// Simple markdown-like parser
function parseContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-[#d3d3d3] mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-[#d3d3d3] mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-[#d3d3d3] mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#714DD7] hover:underline">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[#1A1A1A] p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm font-mono text-[#d3d3d3]">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-[#1A1A1A] px-2 py-0.5 rounded text-sm font-mono text-[#714DD7]">$1</code>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="text-[#878787] ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="text-[#878787] ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-[#878787] text-lg leading-relaxed my-4">')
    // Line breaks
    .replace(/\n/g, '<br>');
}

export default function DynamicPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Page not found");
        return r.json();
      })
      .then(setPage)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="text-white font-poppins text-2xl">loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center gap-6">
        <div className="text-white font-poppins text-4xl">404</div>
        <p className="text-[#878787] font-poppins text-xl">page not found</p>
        <a href="/" className="text-[#714DD7] hover:underline">go home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white font-poppins">
      {/* Cover image */}
      {page.cover_image && (
        <div className="w-full h-[40vh] relative">
          <img
            src={page.cover_image}
            alt={page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#090909]" />
        </div>
      )}

      {/* Content */}
      <motion.div
        className="max-w-3xl mx-auto px-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-[#878787] text-sm mb-4">
            <span>{page.page_type}</span>
            {page.published_at && (
              <>
                <span>•</span>
                <span>{new Date(page.published_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-[#d3d3d3]">{page.title}</h1>
          {page.excerpt && (
            <p className="text-xl text-[#878787] mt-4">{page.excerpt}</p>
          )}
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: parseContent(page.content) }}
        />

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
          <a href="/" className="text-[#714DD7] hover:underline">
            ← back home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
