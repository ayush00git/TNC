import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Users, Hash, Plus, Smile, X, MoreHorizontal, Loader2
} from 'lucide-react';
import { useParams } from 'react-router-dom';

// --- Types ---
interface User {
  id: number;
  name: string;
  avatar: string;
  role?: string;
}

interface Message {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
}

interface RoomDetails {
  id: string;
  title: string;
  description: string;
  members: User[];
}

// --- Mock Database (used for current user only) ---
const MOCK_DB = {
  user: {
    id: 99,
    name: "Alex Dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
};

// --- Sub-Components ---

const MemberModal = ({ isOpen, onClose, members }: { isOpen: boolean; onClose: () => void; members: User[] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0A0514] border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0514]">
          <div>
            <h3 className="text-white font-semibold tracking-wide">Room Members</h3>
            <p className="text-xs text-slate-500">{members.length} members total</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-lg bg-slate-800" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {member.name}
                  </span>
                  {member.role && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {member.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-[#080412]">
          <button className="w-full py-2.5 rounded-lg bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors">
            Invite People
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatWindow() {
  const { roomId } = useParams<{ roomId: string }>(); 

  const [isLoading, setIsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<RoomDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load authenticated user (stored by LoginPage) for chat UI
  useEffect(() => {
    try {
      const raw = localStorage.getItem('authUser');
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; name?: string };
        const displayName =
          parsed.name ||
          (parsed.email ? parsed.email.split('@')[0] : 'You');
        const avatarSeed = parsed.email || displayName;

        setCurrentUser({
          id: 99,
          name: displayName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            avatarSeed
          )}`,
        });
      } else {
        setCurrentUser(MOCK_DB.user);
      }
    } catch {
      setCurrentUser(MOCK_DB.user);
    }
  }, []);

  useEffect(() => {
    if (!roomId) {
      setActiveRoom(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:8001/api/room/${roomId}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch room: ${res.status}`);
        }

        const data = await res.json();
        const room = Array.isArray(data.room) ? data.room[0] : null;

        if (room) {
          setActiveRoom({
            id: room.roomId,
            title: room.title,
            description: room.description,
            members: [], // backend doesn't send members yet
          });

          // You can later replace this with a real messages API
          setMessages([]);
        } else {
          setActiveRoom(null);
        }
      } catch (err) {
        console.error(err);
        setActiveRoom(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim()) return;

    const effectiveUser = currentUser || MOCK_DB.user;

    const newMessage: Message = {
      id: Date.now(),
      userId: effectiveUser.id,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#060010] text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium tracking-wide">Loading Channel...</p>
      </div>
    );
  }

  // --- Render Empty/Error State ---
  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-[#060010] text-slate-500">
        <p>Channel not found.</p>
      </div>
    );
  }

  // --- Render Main Chat ---
  const effectiveUser = currentUser || MOCK_DB.user;
  const allMembers = [effectiveUser, ...activeRoom.members];

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#060010] relative min-w-0">
      
      <MemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
        members={allMembers} 
      />

      {/* Dynamic Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#060010]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-slate-400" />
          <div>
            <h2 className="font-semibold text-white tracking-wide">{activeRoom.title}</h2>
            <p className="text-xs text-slate-500 font-light hidden sm:block">{activeRoom.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMemberModalOpen(true)}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all duration-200 group"
            title="View Members"
          >
            <Users size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
             <MoreHorizontal size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Message Stream */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" 
        ref={scrollRef}
      >
          {/* Dynamic Welcome Message */}
          <div className="py-8 border-b border-white/5 mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{activeRoom.title}!</h1>
            <p className="text-slate-400">
              This is the start of the <span className="text-indigo-400">{activeRoom.title}</span> conversation.
            </p>
          </div>

          {messages.map((msg, idx) => {
            const user = allMembers.find(m => m.id === msg.userId) || effectiveUser;
            const isMe = msg.userId === effectiveUser.id;
            const prevMsg = messages[idx - 1];
            const isSequence = prevMsg && prevMsg.userId === msg.userId; 

            return (
              <div 
                key={msg.id} 
                className={`group flex gap-4 ${isSequence ? 'mt-1' : 'mt-6'} hover:bg-white/[0.02] -mx-4 px-4 py-1 rounded-lg transition-colors`}
              >
                {!isSequence ? (
                    <div className="flex-shrink-0 mt-0.5">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl bg-slate-800" />
                    </div>
                ) : (
                  <div className="w-10 flex-shrink-0 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 text-right pt-2 select-none">
                    {msg.timestamp.split(' ')[0]}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {!isSequence && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium hover:underline cursor-pointer ${isMe ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {user.name}
                      </span>
                      {user.role && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1A1625] text-slate-400 border border-white/5">
                          {user.role}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-light ml-1">{msg.timestamp}</span>
                    </div>
                  )}
                  <p className="text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6 pt-2 bg-[#060010]">
        <form 
          onSubmit={handleSendMessage}
          className="bg-[#0A0514] rounded-full border-2 border-white/5 focus-within:border-indigo-500/30 transition-colors p-2 flex items-end gap-2"
        >
          <button type="button" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors rounded-full hover:bg-white/5">
            <Plus size={20} strokeWidth={2} />
          </button>
          
          <div className="flex-1 py-2">
              <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message #${activeRoom.title}`}
              className="w-full bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-600 font-light ml-2"
              />
          </div>

          <div className="flex items-center gap-1 pr-1 pb-1">
              <button type="button" className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                <Smile size={20} strokeWidth={1.5} />
              </button>
              <button 
              type="submit"
              disabled={!messageText.trim()}
              className={`
                p-2.5 rounded-full flex items-center justify-center transition-all duration-300
                ${messageText.trim() 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-y-0' 
                  : 'bg-[#1A1625] text-slate-600 translate-y-0 cursor-not-allowed'}
              `}
              >
                <Send size={18} strokeWidth={2} className={messageText.trim() ? 'ml-0.5' : ''} />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}