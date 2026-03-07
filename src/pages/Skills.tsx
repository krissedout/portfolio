import { useEffect, useState } from "react";
import { basehubQuery } from "../lib/basehub";

export default function SkillsPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    basehubQuery<{ skills: { content: { html: string } | null } }>(`
      query SkillsPage {
        skills {
          content {
            html
          }
        }
      }
    `)
      .then((data) => {
        setContent(data.skills?.content?.html ?? "");
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load skills page"))
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
    <div className="w-full h-full flex flex-col items-start justify-start overflow-y-scroll scroll-smooth gap-[100px] no-scrollbar">
      <span className="absolute bottom-[30px] self-center text-[#878787]">psst.. you can scroll!</span>

      {error ? (
        <div className="w-full flex items-center justify-center">
          <span className="text-[#878787]">{error}</span>
        </div>
      ) : (
        <div
          className="w-full prose prose-invert max-w-none font-poppins text-[#878787]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
