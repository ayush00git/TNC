import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../components/NavBar";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const hash = searchParams.get("hash");
            if (!hash) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {
                const res = await fetch(`/api/auth/verify-acc?hash=${hash}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("Email verified successfully! Redirecting...");

                    if (data.token) {
                        setTimeout(() => {
                            navigate("/join-room");
                        }, 1500);
                    }
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            }
        };

        // Adding a small delay to prevent flickering if api is too fast
        setTimeout(verify, 1500);
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#060010] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Navbar />
            <div className="w-full max-w-md relative z-10">

                {/* Main Card - Removed Gradients/Glows */}
                <div className="bg-[#0A0514] border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative">

                    {/* Status Icon Area - Clean */}
                    <div className="flex justify-center mb-8">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner transition-colors duration-500 ${status === 'loading' ? 'bg-[#1A1625]' :
                                status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                    'bg-red-500/10 border-red-500/20'
                            }`}>
                            {status === "loading" && (
                                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" strokeWidth={1.5} />
                            )}
                            {status === "success" && (
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in duration-300" strokeWidth={1.5} />
                            )}
                            {status === "error" && (
                                <XCircle className="w-10 h-10 text-red-400 animate-in zoom-in duration-300" strokeWidth={1.5} />
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
                        {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
                    </h1>

                    <p className="text-slate-400 font-light leading-relaxed mb-10 min-h-[48px]">
                        {message}
                    </p>

                    {/* Action Button */}
                    {status !== "loading" && (
                        <button
                            onClick={() => navigate("/login")}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`
                                w-full py-4 px-6 rounded-full
                                bg-[#060010] border-2 cursor-pointer
                                text-sm font-medium tracking-wider
                                flex items-center justify-center gap-2
                                transition-all duration-300 ease-out
                                ${isHovered
                                    ? 'border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10'
                                    : 'border-white/10 text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            <span>Go to Login</span>
                            <ArrowRight
                                className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                            />
                        </button>
                    )}
                </div>

                {/* Footer Brand */}
                <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-300">
                    <ShieldCheck className="w-5 h-5 mx-auto text-slate-500 mb-2" strokeWidth={1.5} />
                    <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">Secure Verification</p>
                </div>

            </div>
        </div>
    );
}