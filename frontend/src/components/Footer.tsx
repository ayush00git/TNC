import { Github, Linkedin, Instagram, Terminal, GitPullRequest, User } from 'lucide-react';
import { BsTwitterX } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060010] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* About Developer Section */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2 text-indigo-400">
             <Terminal size={18} />
             <span className="text-sm font-semibold uppercase tracking-wider">About Developer</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Note: Update hrefs with actual social links */}
             <a href="https://www.instagram.com/ayyush_z/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all" aria-label="Instagram">
                <Instagram size={20} />
             </a>
             <a href="https://www.linkedin.com/in/ayush-kumar-368446246/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all" aria-label="LinkedIn">
                <Linkedin size={20} />
             </a>
             <a href="https://github.com/ayush00git" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all" aria-label="GitHub">
                <Github size={20} />
             </a>
             <a href="https://x.com/AyushKumar_S" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 transition-all" aria-label="Twitter">
                <BsTwitterX size={20} />
             </a>
             <a href="https://cli.ayushz.me" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 transition-all" aria-label="Twitter">
                <User size={20} />
             </a>
          </div>
        </div>

        {/* Contribution & Credits */}
        <div className="flex flex-col items-center md:items-end gap-3">
           <a 
             href="https://github.com/ayush00git/TNC" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0514] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer"
           >
             <GitPullRequest size={16} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
             <span className="text-sm text-slate-300 group-hover:text-white">Contribute to Project</span>
           </a>

           <a 
             href="https://github.com/ayush00git" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-xs text-slate-600 hover:text-indigo-400 transition-colors"
           >
             Developed by Ayush
           </a>
        </div>

      </div>
    </footer>
  );
}