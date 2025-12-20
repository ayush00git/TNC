import React, { useState } from "react";
import {
  ArrowRight,
  Box,
  Cpu,
  Cloud,
  Palette,
  Layout,
  Server,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
// Interface for type safety
interface Room {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
}

// Data Array - Hardcoded as requested
const ROOM_DATA: Room[] = [
  {
    id: 1,
    title: "Blockchain",
    slug: "blockchain",
    description:
      "Discussions on decentralized ledgers, smart contracts, Web3 protocols, and the future of DeFi.",
    icon: Box,
  },
  {
    id: 2,
    title: "AI/ML",
    slug: "ai-ml",
    description:
      "Deep dive into Large Language Models, neural networks, computer vision, and predictive analytics.",
    icon: Cpu,
  },
  {
    id: 3,
    title: "Cloud",
    slug: "cloud",
    description:
      "Architecture patterns for AWS, Azure, and GCP. Serverless computing and DevOps practices.",
    icon: Cloud,
  },
  {
    id: 4,
    title: "Design",
    slug: "design",
    description:
      "UI/UX principles, design systems, accessibility standards, and creative workshops.",
    icon: Palette,
  },
  {
    id: 5,
    title: "Frontend",
    slug: "frontend",
    description:
      "Modern web development with React, state management, performance optimization, and CSS architecture.",
    icon: Layout,
  },
  {
    id: 6,
    title: "Backend",
    slug: "backend",
    description:
      "API design, database scalability, microservices, and high-performance system engineering.",
    icon: Server,
  },
  {
    id: 7,
    title: "Yaps",
    slug: "yaps",
    description:
      "The digital watercooler. Casual conversations, daily banter, and non-technical discussions.",
    icon: Hash,
  },
];

const ChatRoomCard = ({ room }: { room: Room }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinRoom = async (slug: string) => {
    setJoinError(null);
    try {
      setIsJoining(true);

      console.log("Attempting to join room:", slug); // Debug

      // Hit backend join API so the user is added as a member of this room
      const res = await fetch(`http://localhost:8001/api/room/${slug}/join`, {
        method: "GET",
        credentials: "include",
      });

      console.log("Join API response status:", res.status); // Debug

      let data;
      try {
        data = await res.json();
        console.log("Join API response data:", data); // Debug
      } catch (parseError) {
        console.error("Failed to parse join API response:", parseError);
        const text = await res.text();
        console.error("Response text:", text);
        setJoinError("Failed to join room - invalid response");
        setIsJoining(false);
        return;
      }

      if (!res.ok) {
        console.error("Join API failed:", data);
        setJoinError(data?.message || "Failed to join room");
        setIsJoining(false);
        return;
      }

      console.log("Successfully joined room:", slug); // Debug

      // Refresh joined rooms from API to sync cache with backend (await to ensure cache is updated)
      try {
        console.log("Refreshing joined rooms list..."); // Debug
        const refreshRes = await fetch(
          "http://localhost:8001/api/room/joined",
          {
            credentials: "include",
          }
        );

        console.log("Refresh API response status:", refreshRes.status); // Debug

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          console.log("Refresh API response data:", refreshData); // Debug
          const slugs = (refreshData.rooms || []).map(
            (room: { roomId: string }) => room.roomId
          );
          console.log("Refreshed joined rooms after join:", slugs); // Debug
          localStorage.setItem("joinedRooms", JSON.stringify(slugs));
        } else {
          const errorData = await refreshRes.json().catch(() => ({}));
          console.warn(
            "Failed to refresh joined rooms:",
            refreshRes.status,
            errorData
          );
          // If refresh fails, manually add to cache as fallback
          const raw = localStorage.getItem("joinedRooms");
          const existing: string[] = raw ? JSON.parse(raw) : [];
          if (!existing.includes(slug)) {
            existing.push(slug);
            localStorage.setItem("joinedRooms", JSON.stringify(existing));
            console.log("Added to cache as fallback:", existing); // Debug
          }
        }
      } catch (err) {
        console.error("Error refreshing joined rooms:", err);
        // If refresh fails, manually add to cache as fallback
        try {
          const raw = localStorage.getItem("joinedRooms");
          const existing: string[] = raw ? JSON.parse(raw) : [];
          if (!existing.includes(slug)) {
            existing.push(slug);
            localStorage.setItem("joinedRooms", JSON.stringify(existing));
            console.log("Added to cache as fallback (catch):", existing); // Debug
          }
        } catch (storageErr) {
          console.error("Storage error:", storageErr);
        }
      }

      // On success, navigate into the room chat
      const targetPath = `/room/${slug}`;
      console.log(`Joined room, navigating to: ${targetPath}`);
      navigate(targetPath);
    } catch (err) {
      console.error(err);
      setJoinError("Something went wrong while joining. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col justify-between
        h-full p-8 rounded-2xl
        bg-[#0A0514] border-2 
        transition-all duration-300 ease-out
        ${
          isHovered
            ? "border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.1)]"
            : "border-white/5"
        }
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
              ${isHovered ? "text-indigo-400" : "text-slate-600"}
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
      <div className="mt-8 space-y-2">
        <button
          onClick={() => {
            void handleJoinRoom(room.slug);
          }}
          disabled={isJoining}
          className={`
            w-full py-3 px-6 rounded-full
            bg-[#060010] 
            border-2 ${isJoining ? "cursor-wait opacity-80" : "cursor-pointer"}
            text-sm font-medium tracking-wider
            flex items-center justify-center gap-2
            transition-all duration-300 ease-out
            ${
              isHovered
                ? "border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10"
                : "border-white/5 text-slate-500"
            }
          `}
        >
          <span>{isJoining ? "Joining..." : "Join Room"}</span>
          <ArrowRight
            className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </button>

        {joinError && (
          <p className="text-xs text-red-400 text-center">{joinError}</p>
        )}
      </div>
    </div>
  );
};

const JoinActiveRoom = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header Section */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 mt-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 tracking-tight mb-4">
          Active Rooms
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Select a domain to connect with peers. Real-time discussions for
          engineering, design, and casual yapping.
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
      <Footer />
    </div>
  );
};

export default JoinActiveRoom;
