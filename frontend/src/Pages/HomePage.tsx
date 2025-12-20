import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield, Zap, Code2, LogIn } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function HomePage() {
    const navigate = useNavigate();

    const handleStartChatting = () => {
        const user = localStorage.getItem("authUser");
        if (user) {
            navigate('/join-room');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#060010] text-slate-200 font-sans selection:bg-indigo-500/30">
            <Navbar />
            <div className="relative z-10">

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        v1.0 Now Live - Join the Community
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        The Network for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Creative Developers
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        TNC is the premier workspace for engineers, designers, and founders to connect.
                        Real-time chat, domain-specific rooms, and a <span className="text-indigo-400">community that actually ships.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-community that actually ships.in-from-bottom-8 duration-700 delay-200">
                        <button
                            onClick={handleStartChatting}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Redesigned Log In Button */}
                        <button
                            onClick={() => navigate('/login')}
                            className="
                w-full sm:w-auto px-8 py-4 rounded-full 
                bg-[#060010] 
                border-2 border-white/10 
                text-slate-400 font-medium tracking-wide cursor-pointer
                flex items-center justify-center gap-2
                transition-all duration-300 ease-out
                hover:border-indigo-500/50 hover:text-indigo-100 
                hover:shadow-lg hover:shadow-indigo-500/10 
                hover:-translate-y-0.5
              "
                        >
                            Log In
                            <LogIn size={18} />
                        </button>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-[#0A0514] border border-white/5 hover:border-indigo-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="text-indigo-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real-time Channels</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Instant messaging powered by WebSockets. No lag, just pure conversation flow across 7 distinct domains.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-[#0A0514] border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
                            <p className="text-slate-400 leading-relaxed">
                                End-to-end encrypted verification and secure authentication ensuring your discussions remain private.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-[#0A0514] border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Built on a modern stack for maximum performance. Zero bloat, optimized for developer workflows.
                            </p>
                        </div>

                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
}