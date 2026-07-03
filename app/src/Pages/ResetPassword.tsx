
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../components/NavBar";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setStatus("error");
            setMessage("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch(`/api/auth/reset-password?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setStatus("error");
                setMessage(data.message || "Failed to reset password.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060010] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Navbar />
            <div className="w-full max-w-md relative z-10">

                <div className="bg-[#0A0514] border border-white/10 rounded-3xl p-8 shadow-2xl relative">

                    {/* Header */}
                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Set New Password</h1>
                        <p className="text-slate-400 font-light text-sm">Create a secure password for your account.</p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">All Set!</h3>
                            <p className="text-slate-400">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {status === "error" && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
                                    <XCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className={`
                                    w-full py-4 px-6 rounded-full
                                    bg-[#060010] border-2 cursor-pointer
                                    text-sm font-medium tracking-wider
                                    flex items-center justify-center gap-2
                                    transition-all duration-300 ease-out
                                    ${isLoading || !token ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${isHovered && !isLoading && token
                                            ? 'border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10'
                                            : 'border-white/10 text-slate-500 hover:text-slate-300'}
                                `}
                                >
                                    <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                                    {!isLoading && <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
