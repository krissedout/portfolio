import { useEffect } from "react";
import { handleQuickCallback } from "@ave-id/sdk/client";

export default function AveCallbackPage() {
  useEffect(() => {
    handleQuickCallback({ fallbackPath: "/" }).catch((err) => {
      console.error("[Ave callback] error:", err);
      window.location.replace("/?auth_error=" + encodeURIComponent(String(err)));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center">
      <div className="text-white font-poppins text-2xl">signing in...</div>
    </div>
  );
}
