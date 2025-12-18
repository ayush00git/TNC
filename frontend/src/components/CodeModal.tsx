import React, { useState, useEffect } from "react";
import { X, Code } from "lucide-react";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (code: string) => void;
}

const CodeModal = ({ isOpen, onClose, onShare }: CodeModalProps) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (code.trim()) {
      onShare(code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0A0514] border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0514]">
          <div className="flex items-center gap-3">
            <Code size={18} className="text-indigo-400" />
            <h3 className="text-white font-semibold tracking-wide">
              Share Code Snippet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-[#060010] border border-white/10 rounded-lg p-4 text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            placeholder="Paste your code here..."
          />
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-[#080412] flex justify-end">
          <button
            onClick={handleShare}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
