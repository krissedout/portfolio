import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { basehubQuery } from "../lib/basehub";
import { renderMarkdown } from "../lib/richText";

type Page = {
  _title: string;
  _slug: string;
  content: { markdown: string } | null;
  pageType: string | null;
  excerpt: string | null;
  coverImage: {
    url: string;
    alt: string | null;
  } | null;
  publishedAt: string | null;
};

export default function DynamicPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    basehubQuery<{ pages: { items: Page[] } }>(
      `
        query DynamicPage($slug: String!) {
          pages(first: 1, filter: { _sys_slug: { eq: $slug } }) {
            items {
              _title
              _slug
              pageType
              excerpt
              publishedAt
              content {
                markdown
              }
              coverImage {
                __typename
                ... on BlockImage {
                  url
                  alt
                }
              }
            }
          }
        }
      `,
      { slug }
    )
      .then((data) => {
        const nextPage = data.pages?.items?.[0] ?? null;
        if (!nextPage) {
          throw new Error("Page not found");
        }

        setPage(nextPage);
      })
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
      {page.coverImage && (
        <div className="w-full h-[40vh] relative">
          <img
            src={page.coverImage.url}
            alt={page.coverImage.alt ?? page._title}
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
        <div className="mb-8">
          <div className="flex items-center gap-4 text-[#878787] text-sm mb-4">
            <span>{page.pageType}</span>
            {page.publishedAt && (
              <>
                <span>•</span>
                <span>{new Date(page.publishedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-[#d3d3d3]">{page._title}</h1>
          {page.excerpt && (
            <p className="text-xl text-[#878787] mt-4">{page.excerpt}</p>
          )}
        </div>

        <div 
          className="rich-content rich-content--article"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content?.markdown ?? "") }}
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
