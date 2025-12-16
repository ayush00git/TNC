import React, { useState } from 'react';
import { ArrowRight, Box, Cpu, Cloud, Palette, Layout, Server, Hash } from 'lucide-react';

// Interface for type safety
interface Room {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

// Data Array - Hardcoded as requested
const ROOM_DATA: Room[] = [
  {
    id: 1,
    title: "Blockchain",
    description: "Discussions on decentralized ledgers, smart contracts, Web3 protocols, and the future of DeFi.",
    icon: Box
  },
  {
    id: 2,
    title: "AI/ML",
    description: "Deep dive into Large Language Models, neural networks, computer vision, and predictive analytics.",
    icon: Cpu
  },
  {
    id: 3,
    title: "Cloud",
    description: "Architecture patterns for AWS, Azure, and GCP. Serverless computing and DevOps practices.",
    icon: Cloud
  },
  {
    id: 4,
    title: "Design",
    description: "UI/UX principles, design systems, accessibility standards, and creative workshops.",
    icon: Palette
  },
  {
    id: 5,
    title: "Frontend",
    description: "Modern web development with React, state management, performance optimization, and CSS architecture.",
    icon: Layout
  },
  {
    id: 6,
    title: "Backend",
    description: "API design, database scalability, microservices, and high-performance system engineering.",
    icon: Server
  },
  {
    id: 7,
    title: "Yaps",
    description: "The digital watercooler. Casual conversations, daily banter, and non-technical discussions.",
    icon: Hash
  },
];

const ChatRoomCard = ({ room }: { room: Room }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        group relative flex flex-col justify-between
        h-full p-8 rounded-2xl
        bg-[#0A0514] border-2 
        transition-all duration-300 ease-out
        ${isHovered ? 'border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.1)]' : 'border-white/5'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content Section */}
      <div className="space-y-4">
        {/* Header with Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white tracking-wide group-hover:text-indigo-200 transition-colors">
            {room.title}
          </h3>
          <room.icon 
            className={`
              w-6 h-6 transition-colors duration-300
              ${isHovered ? 'text-indigo-400' : 'text-slate-600'}
            `} 
            strokeWidth={1.5}
          />
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed font-light min-h-[48px]">
          {room.description}
        </p>
      </div>

      {/* Button Section - 8pt spacing (mt-8 = 32px) */}
      <div className="mt-8">
        <button 
          className={`
            w-full py-3 px-6 rounded-full
            bg-[#060010] 
            border-2 cursor-pointer
            text-sm font-medium tracking-wider
            flex items-center justify-center gap-2
            transition-all duration-300 ease-out
            ${isHovered 
              ? 'border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10' 
              : 'border-white/5 text-slate-500'}
          `}
        >
          <span>Join Room</span>
          <ArrowRight 
            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
};

const ChatRoom = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 tracking-tight mb-4">
          Active Channels
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Select a domain to connect with peers. Real-time discussions for engineering, design, and casual yapping.
        </p>
      </div>

      {/* Grid Layout Section */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ROOM_DATA.map((room) => (
            <ChatRoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>

      {/* Subtle Background Glow Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[120px]" />
      </div>

    </div>
  );
};

export default ChatRoom;