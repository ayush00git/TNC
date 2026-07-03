import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Sparkles, ArrowUp } from 'lucide-react';

interface MockMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ShowCase() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MockMessage[]>([
    { id: 1, text: "Try sending a message to see how fast TNC is!", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg: MockMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate "Instant" Network Delay then Response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: MockMessage = { 
        id: Date.now() + 1, 
        text: "Welcome to the TNC network! This is a live demo of our real-time engine.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600); // 600ms delay feels natural but fast
  };

  return (
    <section className="py-24 px-6 bg-[#060010] border-t border-white/5 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
            <Sparkles size={14} />
            <span>Interactive Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Zero Latency</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Go ahead, type something below. Our WebSocket engine handles message delivery in milliseconds.
          </p>
        </div>

        {/* The Mock Chat Interface */}
        <div className="w-full max-w-md mx-auto bg-[#0A0514] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-[500px]">
          
          {/* Mock Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#0A0514] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Bot size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A0514] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">TNC Bot</h3>
                <p className="text-indigo-400 text-xs font-medium">Online</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-500/50" />
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                  ${msg.sender === 'user' ? 'bg-slate-700 text-white' : 'bg-indigo-500/10 text-indigo-400'}
                `}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`
                  max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-[#1A1625] text-slate-300 rounded-tl-none border border-white/5'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-1 text-indigo-400">
                   <Bot size={14} />
                </div>
                <div className="bg-[#1A1625] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0A0514] border-t border-white/5">
            <form 
              onSubmit={handleSend}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-[#151020] border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`
                  absolute right-1.5 p-2 rounded-full flex items-center justify-center transition-all duration-200
                  ${input.trim() 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105' 
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'}
                `}
              >
                <ArrowUp size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}