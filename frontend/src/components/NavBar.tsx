import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Menu, X, Terminal, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem("authUser");
      setIsAuthenticated(!!authUser);
    };

    checkAuth();
    // Listen for storage events in case it changes in another tab, 
    // though for single tab navigation, re-renders or window-events are needed.
    // For now, simple check on mount is standard for this codebase style.
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Helper to check active state for styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#060010]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            TNC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">


          <Link
            to="/blogs"
            className={`text-sm font-medium transition-colors ${isActive('/blogs') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Blogs
          </Link>

          {isAuthenticated ? (
            <Link
              to="/room/yaps"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/join-room') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <MessageSquare size={16} />
              Yaps Room
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${isActive('/login') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={`text-sm font-medium transition-colors ${isActive('/signup') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Sign Up
              </Link>
            </>
          )}

          <div className="h-4 w-px bg-white/10 mx-2" />

          {/* Github Link */}
          <a
            href="https://github.com/ayush00git/TNC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>

          {/* Developer HTML Logo with Tooltip */}
          <div className="relative group/tooltip">
            <a
              href="https://github.com/ayush00git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A0514] border border-white/10 text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
            >
              <Terminal size={20} strokeWidth={2} />
            </a>

            {/* The Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-[#1A1625] border border-white/10 rounded-lg text-xs font-medium text-slate-200 whitespace-nowrap opacity-0 translate-y-2 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-200 pointer-events-none shadow-xl z-50">
              Know the developer
              <div className="absolute -top-1 right-3 w-2 h-2 bg-[#1A1625] border-t border-l border-white/10 rotate-45" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#060010] border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
          <Link to="/blogs" className="text-slate-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
          {isAuthenticated ? (
            <Link to="/join-room" className="text-slate-300 hover:text-white py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <MessageSquare size={16} />
              Yaps Room
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="text-slate-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
          <Link to="/contact-us" className="text-slate-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          <div className="h-[1px] bg-white/10 w-full my-2" />
          <div className="flex items-center gap-6 pt-2">
            <a href="https://github.com/ayush00git/TNC" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-2">
              <Github size={20} /> <span className="text-sm">Source Code</span>
            </a>
            <a href="https://github.com/ayush00git" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 flex items-center gap-2">
              <Terminal size={20} /> <span className="text-sm">Developer</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}