import React from 'react';
import { Box, Cpu, Cloud, Palette, Layout, Server, Hash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Types ---
interface Room {
  id: number;
  title: string;
  slug: string;
  icon: React.ElementType;
}

// --- Navigation Data ---
const ROOMS: Room[] = [
  { id: 1, title: "Blockchain", slug: "blockchain", icon: Box },
  { id: 2, title: "Yaps", slug: "yaps", icon: Hash },
  { id: 3, title: "AI/ML", slug: "ai-ml", icon: Cpu },
  { id: 4, title: "Cloud", slug: "cloud", icon: Cloud },
  { id: 5, title: "Design", slug: "design", icon: Palette },
  { id: 6, title: "Frontend", slug: "frontend", icon: Layout },
  { id: 7, title: "Backend", slug: "backend", icon: Server }
];

export default function RoomSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; // e.g. "/room/design"
  
  // Logic to determine which tab is active based on the current URL path
  const activeIndex = ROOMS.findIndex(room => currentPath.includes(room.slug));
  // Default to 0 if no match found (e.g. root path)
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const handleNavigation = (slug: string) => {
    const targetPath = `/room/${slug}`;
    console.log(`Navigating to: ${targetPath}`);
    navigate(targetPath);
  };

  return (
    <nav className="w-20 flex flex-col items-center py-6 bg-[#060010] border-r border-white/5 z-20 flex-shrink-0 h-screen sticky top-0">
      
      {/* Brand / Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer hover:opacity-90 transition-opacity">
          <span className="font-bold text-white">D</span>
        </div>
      </div>

      {/* Navigation Items Container */}
      <div className="flex-1 w-full flex flex-col items-center relative gap-4">
        
        {/* Animated Sliding Background - moves smoothly behind the icons */}
        <div 
          className="absolute w-12 h-12 bg-[#1A1625] rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ 
            top: `${safeActiveIndex * 64}px`, // 48px icon + 16px gap = 64px stride
            opacity: activeIndex >= 0 ? 1 : 0 
          }}
        />
        
        {/* Animated Active Indicator - the small purple strip on the left */}
        <div 
          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] delay-75"
          style={{ 
            top: `${safeActiveIndex * 64 + 12}px`,
            opacity: activeIndex >= 0 ? 1 : 0 
          }}
        />

        {ROOMS.map((room) => {
          // Check strict equality for hover/active styling logic if needed
          const isActive = currentPath.includes(room.slug);
          
          return (
            <button
              key={room.id}
              onClick={() => handleNavigation(room.slug)}
              className={`
                relative z-10 group w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-colors duration-300
                ${isActive 
                  ? 'text-indigo-400' 
                  : 'text-slate-500 hover:text-slate-300'}
              `}
              aria-label={`Maps to ${room.title}`}
            >
              <room.icon size={22} strokeWidth={1.5} />
              
              {/* Tooltip */}
              <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-[#1A1625] border border-white/10 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                {room.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Avatar (Bottom) */}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 hover:border-indigo-500/50 transition-colors">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="User Profile" 
            className="w-full h-full bg-slate-800" 
          />
        </button>
      </div>
    </nav>
  );
}