"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call for security, though hardcoded here
    setTimeout(() => {
      if (username === "admin" && password === "inferno123") {
        // Set a simple cookie to track auth status
        document.cookie = "admin_token=authenticated; path=/; max-age=86400"; // 1 day
        router.push("/admin/dashboard");
      } else {
        setError("Username atau password salah");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
            <Lock className="text-red-500" size={24} />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-white/60 text-sm mt-2 text-center">
            Silakan login untuk mengakses dashboard admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-white/80 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/30"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/30"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
