import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { startQuickSignIn, getQuickIdentity } from "@ave-id/sdk/client";

export default function LoginPage() {
  const error = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (!authError) return null;
    switch (authError) {
      case "unauthorized":
        return "This identity is not authorized to access the admin panel.";
      case "token_exchange_failed":
        return "Failed to exchange authentication token. Please try again.";
      case "invalid_state":
        return "Invalid authentication state. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  }, []);

  useEffect(() => {
    if (getQuickIdentity()) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center">
      <motion.div
        className="bg-[#121212]/80 backdrop-blur-[20px] p-12 max-w-md w-full mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo or icon */}
          <div className="text-[#714DD7] text-5xl font-poppins font-bold">login</div>
          
          <p className="text-[#878787] font-poppins text-center">
            sign in with your Ave identity to edit your portfolio
          </p>

          {error && (
            <div className="w-full p-4 bg-[#FF4444]/20 border border-[#FF4444] rounded text-[#FF6666] text-center text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => startQuickSignIn({ returnTo: "/" })}
            className="w-full py-3 bg-[#714DD7] text-white font-poppins text-xl text-center hover:bg-[#6041BA] transition"
          >
            sign in with Ave
          </button>

          <a
            href="/"
            className="text-[#878787] hover:text-white transition-colors text-sm"
          >
            ← back to portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
