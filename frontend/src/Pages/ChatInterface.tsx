import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Cpu, Cloud, Palette, Layout, Server, Hash, 
  Send, Users, MoreVertical, Hash as HashIcon, Plus, Smile, Paperclip
} from 'lucide-react';

// --- Types ---
interface Room {
  id: number;
  title: string;
  icon: React.ElementType;
  description: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  role?: string;
}

interface Message {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

// --- Mock Data ---
const ROOMS: Room[] = [
  { id: 1, title: "Blockchain", icon: Box, description: "Web3 & DeFi Protocol" },
  { id: 2, title: "Yaps", icon: Hash, description: "General Discussion" },
  { id: 3, title: "AI/ML", icon: Cpu, description: "Neural Networks" },
  { id: 4, title: "Cloud", icon: Cloud, description: "AWS/Azure Arch" },
  { id: 5, title: "Design", icon: Palette, description: "UI/UX Systems" },
  { id: 6, title: "Frontend", icon: Layout, description: "React & CSS" },
  { id: 7, title: "Backend", icon: Server, description: "DB & API Design" }
];

const CURRENT_USER: User = {
  id: 99,
  name: "Alex Dev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  status: 'online'
};

const MEMBERS: User[] = [
  { id: 1, name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", status: 'online', role: 'Admin' },
  { id: 2, name: "Mike Ross", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", status: 'dnd', role: 'Mod' },
  { id: 3, name: "Jessica Suits", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica", status: 'online' },
  { id: 4, name: "Harvey Specter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harvey", status: 'idle' },
  { id: 5, name: "Louis Litt", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Louis", status: 'offline' },
  { id: 6, name: "Donna Paulsen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Donna", status: 'online' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, userId: 1, content: "Has anyone deployed the new smart contract to Sepolia testnet yet?", timestamp: "10:42 AM" },
  { id: 2, userId: 2, content: "I'm working on it. The gas optimization check failed on the staking loop.", timestamp: "10:44 AM" },
  { id: 3, userId: 1, content: "Classic reentrancy guard issue?", timestamp: "10:45 AM" },
  { id: 4, userId: 2, content: "Nah, just inefficient storage mapping. Fixing it now.", timestamp: "10:45 AM" },
  { id: 5, userId: 3, content: "Can you push the ABI updates when done? I need to update the frontend hooks.", timestamp: "10:48 AM" },
  { id: 6, userId: 2, content: "Sure thing. Give me 15 mins.", timestamp: "10:49 AM" },
];

// --- Components ---

const StatusIndicator = ({ status }: { status: User['status'] }) => {
  const colors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-slate-500'
  };
  return (
    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#060010] ${colors[status]}`} />
  );
};

export default function ChatInterface() {
  const [activeRoomId, setActiveRoomId] = useState(1);
  const [showMembers, setShowMembers] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeRoom = ROOMS.find(r => r.id === activeRoomId) || ROOMS[0];
  const activeIndex = ROOMS.findIndex(r => r.id === activeRoomId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      userId: CURRENT_USER.id,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  return (
    <div className="flex h-screen bg-[#060010] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. SLIM ICON RAIL (Navigation) */}
      <nav className="w-20 flex flex-col items-center py-6 bg-[#060010] border-r border-white/5 z-20 flex-shrink-0">
        <div className="mb-8">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <span className="font-bold text-white">D</span>
           </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center relative gap-4">
          
          {/* Animated Sliding Background */}
          <div 
            className="absolute w-12 h-12 bg-[#1A1625] rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ top: `${activeIndex * 64}px` }}
          />
          {/* Animated Sliding Indicator */}
          <div 
            className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] delay-75"
            style={{ top: `${activeIndex * 64 + 12}px` }}
          />

          {ROOMS.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`
                  relative z-10 group w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300
                  ${isActive 
                    ? 'text-indigo-400' 
                    : 'text-slate-500 hover:text-slate-300'}
                `}
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

        <div className="mt-auto">
          <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 hover:border-indigo-500/50 transition-colors">
            <img src={CURRENT_USER.avatar} alt="Me" className="w-full h-full bg-slate-800" />
          </button>
        </div>
      </nav>

      {/* 2. MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#060010]">
        
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#060010]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <HashIcon className="w-5 h-5 text-slate-400" />
            <div>
              <h2 className="font-semibold text-white tracking-wide">{activeRoom.title}</h2>
              <p className="text-xs text-slate-500 font-light hidden sm:block">{activeRoom.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className={`p-2 rounded-lg transition-colors ${showMembers ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <Users size={20} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Messages Stream */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" 
          ref={scrollRef}
        >
           {/* Welcome Message */}
           <div className="mb-8 pt-4 pb-8 border-b border-white/5">
              <div className="w-16 h-16 rounded-3xl bg-[#1A1625] flex items-center justify-center mb-4">
                <activeRoom.icon size={32} className="text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{activeRoom.title}!</h1>
              <p className="text-slate-400 font-light text-lg">
                This is the start of the <span className="text-indigo-300 font-medium">{activeRoom.title}</span> channel.
                {activeRoom.description}
              </p>
           </div>

           {/* Message List */}
           {messages.map((msg, idx) => {
             const user = MEMBERS.find(m => m.id === msg.userId) || CURRENT_USER;
             const isMe = msg.userId === CURRENT_USER.id;
             const prevMsg = messages[idx - 1];
             const isSequence = prevMsg && prevMsg.userId === msg.userId; // Check if same user sent prev message

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
        <div className="px-6 pb-6 pt-2">
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
      </main>

      {/* 3. RIGHT MEMBER SIDEBAR (Toggleable) */}
      <aside className={`
        w-64 bg-[#080412] border-l border-white/5 flex flex-col transition-all duration-300 ease-in-out
        ${showMembers ? 'mr-0 opacity-100' : '-mr-64 opacity-0 overflow-hidden'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <h3 className="font-semibold text-slate-400 text-sm tracking-wide uppercase">Members</h3>
          <span className="ml-auto text-xs text-slate-600 font-mono bg-white/5 px-2 py-0.5 rounded">
            {MEMBERS.length + 1}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Group: Online */}
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 px-2">
              Online — 3
            </div>
            <div className="space-y-1">
               {/* Me */}
               <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors">
                  <div className="relative">
                    <img src={CURRENT_USER.avatar} alt="Me" className="w-8 h-8 rounded-lg bg-slate-800" />
                    <StatusIndicator status="online" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white">{CURRENT_USER.name}</div>
                    <div className="text-[10px] text-slate-500">Thinking...</div>
                  </div>
               </div>
               
               {MEMBERS.filter(m => m.status !== 'offline').map(member => (
                 <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-lg bg-slate-800" />
                      <StatusIndicator status={member.status} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300 group-hover:text-white">
                        {member.name}
                      </div>
                      {member.role && (
                         <div className="text-[10px] text-indigo-400 font-medium">{member.role}</div>
                      )}
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Group: Offline */}
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 px-2">
              Offline — 2
            </div>
            <div className="space-y-1">
               {MEMBERS.filter(m => m.status === 'offline').map(member => (
                 <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors opacity-60 hover:opacity-100">
                    <div className="relative grayscale">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-lg bg-slate-800" />
                      <StatusIndicator status={member.status} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300 group-hover:text-white">{member.name}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}