import { useEffect, useState } from "react";
import { basehubQuery } from "../lib/basehub";
import { renderMarkdown } from "../lib/richText";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    basehubQuery<{ about: { content: { markdown: string } | null } }>(`
      query AboutPage {
        about {
          content {
            markdown
          }
        }
      }
    `)
      .then((data) => {
        setContent(renderMarkdown(data.about?.content?.markdown ?? ""));
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load about page"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[#878787]">loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth no-scrollbar">
      <span className="absolute bottom-[30px] self-center text-[#878787]">psst.. you can scroll!</span>

      {error ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[#878787]">{error}</span>
        </div>
      ) : (
        <div
          className="w-full rich-content rich-content--panel"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
