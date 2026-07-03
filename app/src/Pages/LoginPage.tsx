import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchAndNavigate = async () => {
    try {
      const res = await fetch("/api/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // If no rooms are found or another error occurs, navigate to the default room creation page
        navigate("/room");
        return;
      }

      const { roomIds } = data;
      if (roomIds && roomIds.length > 0) {
        navigate(`/room/${roomIds[0]}`);
      } else {
        navigate("/room");
      }
    } catch (err) {
      console.error("Failed to fetch rooms, navigating to default:", err);
      navigate("/room");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to login");
        return;
      }

      // Persist user info for chat UI
      try {
        localStorage.setItem("authUser", JSON.stringify(data.user));
      } catch {
        // ignore storage failures
      }

      // On successful login, fetch rooms and navigate accordingly
      await fetchAndNavigate();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Navbar />
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 font-light">
            Enter your credentials to access the workspace.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Messages */}
          {error && (
            <p className="text-sm text-red-400 text-center mb-2">{error}</p>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail
                  className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock
                  className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                w-full py-4 px-6 rounded-full
                bg-[#060010] 
                border-2 cursor-pointer
                text-sm font-medium tracking-wider
                flex items-center justify-center gap-2
                transition-all duration-300 ease-out
                ${
                  isHovered
                    ? "border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10"
                    : "border-white/10 text-slate-500 hover:text-slate-300"
                }
              `}
            >
              <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
              <ArrowRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 text-sm font-light">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
