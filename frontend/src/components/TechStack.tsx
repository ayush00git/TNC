import React from 'react';
import { 
  Database, Server, Globe, Wind, Lock, Mail, Cloud, Cpu, Zap, Radio 
} from 'lucide-react';

export default function TechStack() {
  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans py-20 px-6">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Cpu size={14} />
            <span>Architecture Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Scale & Speed</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
             A deep dive into the modern stack powering TNC's real-time capabilities, security protocols, and cloud infrastructure.
          </p>
        </div>

        {/* 1. HERO: Real-time Architecture */}
        <div className="mb-8">
           <div className="p-8 md:p-12 rounded-3xl bg-[#0A0514] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Radio className="text-indigo-400 w-8 h-8 animate-pulse" />
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Event-Driven Real-time Engine</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                       The core communication layer is built on <span className="text-indigo-300 font-medium">Node.js</span> and <span className="text-indigo-300 font-medium">Socket.io</span>. 
                       This enables bidirectional, low-latency communication where the server pushes events (new messages, typing indicators) instantly to the client.
                       On the frontend, the <span className="text-indigo-300 font-medium">React.js</span> client uses <code>socket.io-client</code> to maintain persistent connections, ensuring the UI updates in milliseconds without page reloads.
                    </p>
                    
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-3">
                       <span className="px-3 py-1 rounded-lg bg-[#1A1625] border border-white/5 text-xs font-mono text-indigo-300">Node.js</span>
                       <span className="px-3 py-1 rounded-lg bg-[#1A1625] border border-white/5 text-xs font-mono text-indigo-300">Socket.io</span>
                       <span className="px-3 py-1 rounded-lg bg-[#1A1625] border border-white/5 text-xs font-mono text-indigo-300">React.js</span>
                       <span className="px-3 py-1 rounded-lg bg-[#1A1625] border border-white/5 text-xs font-mono text-indigo-300">WebSockets</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. GRID: Security & Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           
           {/* JWT Auth */}
           <div className="p-8 rounded-3xl bg-[#0A0514] border border-white/10 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                 <Lock className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">JWT Authentication</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                 Stateless authentication using JSON Web Tokens. We utilize secure signing algorithms to verify identity on every request, ensuring protected routes remain inaccessible to unauthorized users while maintaining session scalability.
              </p>
              <div className="flex gap-2">
                 <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wide">Security</span>
                 <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wide">Middleware</span>
              </div>
           </div>

           {/* Nodemailer */}
           <div className="p-8 rounded-3xl bg-[#0A0514] border border-white/10 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                 <Mail className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Transactional Email</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                 Powered by <span className="text-white font-medium">Nodemailer</span>. We handle critical user flows like Account Verification and Secure Password Resets through a reliable SMTP transport service, delivering HTML-formatted emails directly to the inbox.
              </p>
              <div className="flex gap-2">
                 <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wide">SMTP</span>
                 <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wide">Backend</span>
              </div>
           </div>

        </div>

        {/* 3. GRID: Other Tech */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           
           <div className="p-6 rounded-2xl bg-[#080412] border border-white/5 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
              <Database className="text-green-500" size={24} />
              <div>
                 <div className="font-bold text-white">MongoDB</div>
                 <div className="text-xs text-slate-500">NoSQL Database</div>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-[#080412] border border-white/5 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
              <Server className="text-gray-400" size={24} />
              <div>
                 <div className="font-bold text-white">Express.js</div>
                 <div className="text-xs text-slate-500">REST API Framework</div>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-[#080412] border border-white/5 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
              <Wind className="text-cyan-400" size={24} />
              <div>
                 <div className="font-bold text-white">Tailwind CSS</div>
                 <div className="text-xs text-slate-500">Utility-first Styling</div>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-[#080412] border border-white/5 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
              <Cloud className="text-orange-400" size={24} />
              <div>
                 <div className="font-bold text-white">AWS S3</div>
                 <div className="text-xs text-slate-500">File Storage</div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}