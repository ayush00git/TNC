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
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinRoom = async (slug: string) => {
    setJoinError(null);
    try {
      setIsJoining(true);
      const res = await fetch(`/api/room/${slug}/join`, {
        method: "GET",
        credentials: "include",
      });

      let data;
      try {
        data = await res.json();
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

      // Refresh joined rooms from API to sync cache with backend (await to ensure cache is updated)
      try {
        const refreshRes = await fetch(
          "/api/room/joined",
          {
            credentials: "include",
          }
        );

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const slugs = (refreshData.rooms || []).map(
            (room: { roomId: string }) => room.roomId
          );
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
          }
        }
      } catch (err) {
        console.error("Error refreshing joined rooms:", err);
        try {
          const raw = localStorage.getItem("joinedRooms");
          const existing: string[] = raw ? JSON.parse(raw) : [];
          if (!existing.includes(slug)) {
            existing.push(slug);
            localStorage.setItem("joinedRooms", JSON.stringify(existing));
          }
        } catch (storageErr) {
          console.error("Storage error:", storageErr);
        }
      }

      // On success, navigate into the room chat
      const targetPath = `/room/${slug}`;
      navigate(targetPath);
    } catch (err) {
      console.error(err);
      setJoinError("Something went wrong while joining. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div
      className="
        group relative flex flex-col justify-between
        h-full p-8 rounded-2xl
        bg-surface-low
        transition-all duration-300 ease-out
      "
    >
      {/* Content Section */}
      <div className="space-y-4">
        {/* Header with Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-on-surface tracking-wide group-hover:text-indigo-200 transition-colors">
            {room.title}
          </h3>
          <room.icon
            className="w-6 h-6 transition-colors duration-300"
            strokeWidth={1.5}
          />
        </div>

        {/* Description */}
        <p className="text-on-surface-muted text-sm leading-relaxed font-light min-h-[48px]">
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
            w-full py-3 px-6 rounded-lg
            bg-primary-container
            ${isJoining ? "cursor-wait opacity-80" : "cursor-pointer"}
            text-sm font-medium tracking-wider
            flex items-center justify-center gap-2
            transition-all duration-300 ease-out
          `}
        >
          <span>{isJoining ? "Joining..." : "Join Room"}</span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-x-1"
          />
        </button>

        {joinError && (
          <p className=" text-xs text-red-400 text-center">{joinError}</p>
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Active Rooms
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Select a domain to connect with peers.
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
      <Footer />
    </div>
  );
};

export default JoinActiveRoom;
