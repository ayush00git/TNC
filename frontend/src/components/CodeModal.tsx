import React, { useState, useEffect } from "react";
import { X, Code, Send } from "lucide-react";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (code: string) => void;
}

const CodeModal = ({ isOpen, onClose, onShare }: CodeModalProps) => {
  const [code, setCode] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (code.trim()) {
      onShare(code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Wrapper for positioning */}
      <div className="relative w-full max-w-2xl">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 md:top-0 p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 z-50 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Main Container */}
        <div className={`
            group relative w-full h-[500px]
            rounded-3xl border-2 
            bg-[#0A0514] overflow-hidden
            transition-all duration-300 ease-out
            ${isFocused 
              ? 'border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]' 
              : 'border-white/10 hover:border-indigo-500/30'}
        `}>
          
          {/* Subtle Label (Visual only) */}
          <div className="absolute top-6 left-8 flex items-center gap-3 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
             <Code size={18} className="text-indigo-400" />
             <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
               Raw Code Snippet
             </span>
          </div>

          {/* Text Area */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full bg-transparent p-8 pt-16 pb-24 text-slate-300 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-slate-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            placeholder="// Paste your code here..."
            spellCheck={false}
          />

          {/* Floating Share Button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={handleShare}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              disabled={!code.trim()}
              className={`
                px-8 py-3 rounded-full 
                bg-[#060010] border-2 
                text-sm font-medium tracking-wide
                flex items-center gap-2
                transition-all duration-300 ease-out
                ${isButtonHovered && code.trim()
                  ? 'border-indigo-500/50 text-indigo-100 shadow-lg shadow-indigo-500/10 -translate-y-0.5' 
                  : 'border-white/10 text-slate-400 shadow-none'}
                ${!code.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Send size={16} strokeWidth={2} className={code.trim() && isButtonHovered ? 'translate-x-0.5 transition-transform' : ''} />
              <span>Share Snippet</span>
            </button>
          </div>

          {/* Background Gradient Mesh (Subtle) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        </div>
      </div>
    </div>
  );
};

export default CodeModal;