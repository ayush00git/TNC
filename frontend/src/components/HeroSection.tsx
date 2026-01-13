import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare, Shield, Zap, Download } from "lucide-react";
import TNCLogo from "./TNCLogo";
import BlogBackground from "./BlogBackground";

export default function HeroSection() {
    const navigate = useNavigate();

    const handleStartChatting = () => {
        const user = localStorage.getItem("authUser");
        if (user) {
            navigate("/join-room");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 p-10 w-full flex flex-col justify-center items-center text-center max-w-screen overflow-hidden relative">
                <BlogBackground className="absolute -z-20 top-0 left-0 "/>
                <TNCLogo className="absolute blur-xl max-w-svh scale-90 max-h-full text-primary-mute top-0 left-1/2 -translate-x-1/2 h-full w-full -z-10"/>
                <h1 className="text-5xl md:text-9xl font-bold text-primary tracking-tight mb-6">
                    The Nerds <br/>
                    Community
                </h1>

                <p className="text-lg md:text-xl text-on-surface-primary max-w-xl mb-10 leading-relaxed ">
                    TNC is the premier workspace for engineers, designers, and founders to connect.
                    Real-time chat, domain-specific rooms, and a <span className="text-primary">community that actually ships.</span>
                </p>

                <div
                    className="flex flex-col sm:flex-row items-center justify-start gap-4 animate-in fade-in slide-community that actually ships.in-from-bottom-8 duration-700 delay-200">
                    <button
                        onClick={handleStartChatting}
                        className="w-full sm:w-auto px-8 py-4 rounded-md bg-primary hover:bg-indigo-500 text-on-primary font-semibold cursor-pointer transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
                    >
                        Get Started
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>

                    {/* Get the App Button */}
                    <a
                        href="https://github.com/ayush00git/TNC/releases/download/v1.0.0/tnc-mobile-v1.0.0.apk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                                w-full sm:w-auto px-8 py-4 rounded-full
                                bg-primary-mute
                                rounded-md
                                border-2 border-white/10
                                text-on-primary-mute font-medium tracking-wide cursor-pointer
                                flex items-center justify-center gap-2
                                transition-all duration-300 ease-out
                                hover:border-primary
                                  "
                        >
                        Get the App
                        <Download size={18}/>
                    </a>
                </div>
            </section>
        </div>
    );
}