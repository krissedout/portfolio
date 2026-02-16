import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (authError) {
      switch (authError) {
        case "unauthorized":
          setError("This identity is not authorized to access the admin panel.");
          break;
        case "token_exchange_failed":
          setError("Failed to exchange authentication token. Please try again.");
          break;
        case "invalid_state":
          setError("Invalid authentication state. Please try again.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    }

    // Check if already authenticated
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = "/";
        }
      });
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

          <a
            href="/api/auth/login"
            className="w-full py-3 bg-[#714DD7] text-white font-poppins text-xl text-center hover:bg-[#6041BA] transition"
          >
            sign in with Ave
          </a>

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
