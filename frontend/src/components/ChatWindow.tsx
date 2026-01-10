import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Hash,
  Plus,
  Smile,
  X,
  MoreHorizontal,
  Loader2,
  Code,
  Image,
  Check,
  AlertCircle,
  ArrowUp,
  Menu,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import CodeModal from "./CodeModal";
import ImageModal from "./ImageModal";
import { socket } from "../services/socket";
import axios from "axios";
import { useBrowserNotifications } from "../hooks/useBrowserNotifications";

// --- Types ---
interface User {
  id: string;
  _id?: string;
  name: string;
  avatar: string;
  role?: string;
}

interface Message {
  _id: string;
  sender: User;
  text: string;
  createdAt: string;
  room?: string;
  imageURL?: string;
  // Compatibility with UI
  id?: number | string;
  userId?: string;
  content?: string;
  timestamp?: string;
  type?: "text" | "code";
  image?: string;
  status?: "sending" | "sent" | "error";
  tempId?: string;
}

interface RoomDetails {
  id: string;
  _id: string;
  title: string;
  description: string;
  members: User[];
}

interface ChatWindowProps {
  roomId?: string;
  onOpenSidebar?: () => void;
  setCurrentRoom: (roomId: string | null) => void;
}

// --- Mock Database (used for fallback) ---
const MOCK_DB = {
  user: {
    id: "99",
    name: "Alex Dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
};

// --- Sub-Components ---

const MemberModal = ({
  isOpen,
  onClose,
  members,
  currentUserId,
}: {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  currentUserId?: string;
}) => {
  const [copied, setCopied] = useState(false);

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

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy invite link", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0A0514] border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0514]">
          <div>
            <h3 className="text-white font-semibold tracking-wide">
              Room Members
            </h3>
            <p className="text-xs text-slate-500">
              {members.length} members total
            </p>
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
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-lg bg-slate-800"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {member.name}
                    {(member.id === currentUserId || member._id === currentUserId) && (
                      <span className="text-slate-500 ml-1">(You)</span>
                    )}
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
          <button
            onClick={handleInvite}
            className="w-full py-2.5 rounded-lg bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              "Invite People"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatWindow({ roomId, onOpenSidebar, setCurrentRoom }: ChatWindowProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<RoomDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Browser notifications
  const { permission, requestPermission, showNotification } = useBrowserNotifications();

  const allMembers = useMemo(() => {
    const members: User[] = activeRoom?.members ? [...activeRoom.members] : [];
    if (currentUser && !members.find((m) => m.id === currentUser.id)) {
      members.unshift(currentUser);
    }
    return members;
  }, [activeRoom, currentUser]);

  const effectiveUser: User = currentUser || MOCK_DB.user;
  const effectiveUserRef = useRef(effectiveUser);

  useEffect(() => {
    effectiveUserRef.current = effectiveUser;
  }, [effectiveUser]);

  // Date separator helper functions
  const getDateLabel = (timestamp: string | Date): string => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to midnight for comparison
    const resetTime = (date: Date) => {
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const messageDateOnly = resetTime(new Date(messageDate));
    const todayOnly = resetTime(new Date(today));
    const yesterdayOnly = resetTime(new Date(yesterday));

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "Dec 25, 2024"
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const groupMessagesWithDates = (messages: Message[]): any[] => {
    if (!messages || messages.length === 0) return [];

    const grouped: any[] = [];
    let lastDate: string | null = null;

    messages.forEach((message) => {
      const dateLabel = getDateLabel(message.createdAt);

      // Insert date separator if date changed
      if (dateLabel !== lastDate) {
        grouped.push({
          type: 'date-separator',
          id: `date-${message.createdAt}`,
          label: dateLabel
        });
        lastDate = dateLabel;
      }

      // Add the actual message
      grouped.push({ ...message, type: 'message' });
    });

    return grouped;
  };

  const handleImageSelect = (dataUrl: string) => {

    setImagePreviewUrl(dataUrl);
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "upload.png", { type: "image/png" });
        setImagePreview(file);
      });

    setIsImageModalOpen(false);
  };

  // Load authenticated user
  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          _id: string;
          email?: string;
          name?: string;
        };
        const displayName =
          parsed.name || (parsed.email ? parsed.email.split("@")[0] : "You");
        const avatarSeed = parsed.email || displayName;

        setCurrentUser({
          id: parsed._id,
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

  // Request notification permission on mount
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Track current room for global notifications
  useEffect(() => {
    if (activeRoom?._id) {
      setCurrentRoom(activeRoom._id);
    } else {
      setCurrentRoom(null);
    }
  }, [activeRoom, setCurrentRoom]);

  // Fetch Room & Messages
  useEffect(() => {
    if (!roomId) {
      setActiveRoom(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchData = async () => {
      try {
        // 1. Fetch Room Details
        const roomRes = await axios.get(`/api/room/${roomId}`, {
          withCredentials: true,
        });

        const roomData = roomRes.data.room[0];
        if (roomData) {
          const members = (roomData.members || []).map((member: any) => ({
            id: member._id,
            name: member.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              member.name
            )}`,
          }));

          setActiveRoom({
            id: roomData.roomId,
            _id: roomData._id,
            title: roomData.title,
            description: roomData.description,
            members: members,
          });

          // 2. Fetch Chat History using the ObjectId
          const messagesRes = await axios.get(`/api/chat/chat-history/${roomData._id}?page=1`, {
            withCredentials: true,
          });

          // Socket Connection using ObjectId
          socket.connect();
          socket.emit("join_room", roomData._id);

          // Transform backend messages to UI format
          const history = messagesRes.data.map((msg: Message) => ({
            ...msg,
            id: msg._id,
            userId: msg.sender ? msg.sender._id : "unknown",
            content: msg.text,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            image: msg.imageURL && msg.imageURL.trim() !== "" ? msg.imageURL : undefined,
            status: "sent",
          }));

          setMessages(history);

        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Socket connection moved inside fetchData to use roomData._id

    const handleReceiveMessage = (newMessage: any) => {
      const formattedMsg: Message = {
        ...newMessage,
        id: newMessage._id,
        userId: newMessage.sender ? newMessage.sender._id : "unknown",
        content: newMessage.text,
        timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image: newMessage.imageURL && newMessage.imageURL.trim() !== "" ? newMessage.imageURL : undefined,
        status: "sent",
      };

      setMessages((prev) => {
        // If this message belongs to current user, try to find the optimistic one
        const currentUserId = effectiveUserRef.current.id || effectiveUserRef.current._id;
        if (formattedMsg.userId === currentUserId) {
          const existingIndex = prev.findIndex(
            (m) => m.status === "sending" && (m.content === formattedMsg.content)
          );
          if (existingIndex !== -1) {
            const newMessages = [...prev];
            newMessages[existingIndex] = formattedMsg;
            return newMessages;
          }
        } else {
          // Message from another user - show browser notification
          const senderName = newMessage.sender?.name || "Someone";
          const messagePreview = newMessage.text || "Sent an image";

          showNotification(`${senderName} in #${activeRoom?.title || 'Chat'}`, {
            body: messagePreview,
            tag: activeRoom?._id || 'chat',
            data: { roomId: activeRoom?._id, roomTitle: activeRoom?.title },
          });
        }
        return [...prev, formattedMsg];
      });
    };

    socket.on("received_message", handleReceiveMessage);
    // Listen for the event name used in the controller code (user used 'receive_message' in their edit)
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("received_message", handleReceiveMessage);
      socket.off("receive_message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node)
      ) {
        setShowAttachmentMenu(false);
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!messageText.trim() && !imagePreview) || !roomId) return;

    if (!activeRoom?._id) return;

    const tempId = Date.now().toString();
    const optimisticMessage: Message = {
      _id: tempId,
      id: tempId,
      tempId: tempId,
      sender: effectiveUser,
      text: messageText,
      content: messageText,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
      room: activeRoom._id,
      userId: effectiveUser.id || effectiveUser._id,
      image: imagePreviewUrl || undefined
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Clear input immediately
    setMessageText("");
    setImagePreview(null);
    setImagePreviewUrl(null);

    const formData = new FormData();
    formData.append("text", optimisticMessage.content || "");
    formData.append("room", activeRoom._id);
    if (imagePreview) {
      formData.append("image", imagePreview);
    }

    try {
      await axios.post(`/api/chat/${activeRoom._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Success is handled by socket event "received_message" which will replace the optimistic message
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "error" } : msg
        )
      );
    }
  };

  const handleShareCode = async (code: string) => {
    if (!roomId) return;

    // Sending code as a regular message but marked as code? 
    // The backend model doesn't seem to have a 'type' field yet. 
    // We will send it as text for now.
    try {
      const formData = new FormData();
      formData.append("text", code); // You might want to wrap this in markdown code blocks like ```{code}```
      formData.append("room", activeRoom!._id);

      await axios.post(`/api/chat/${activeRoom!._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Failed to share code:", error);
    }
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#060010] animate-in fade-in duration-500">
        {/* Centered Content Container */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 1. The Circular Button */}
          <button
            onClick={() => navigate("/join-room")}
            className="
              group relative flex items-center justify-center
              w-24 h-24 rounded-full cursor-pointer
              bg-[#0A0514] border-2 border-white/5 
              transition-all duration-300 ease-out
              hover:border-indigo-500/50 hover:bg-[#110c1d]
              hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]
              hover:-translate-y-2 active:scale-95
            "
          >
            <Plus
              size={40}
              strokeWidth={1.5}
              className="text-slate-600 transition-colors duration-300 group-hover:text-indigo-400"
            />
          </button>
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-white tracking-wide">
              Join Room
            </h3>
            <p className="text-sm text-slate-500 font-light max-w-xs mx-auto">
              OR navigate to the sidebar to see the channels you've joined
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#060010] relative min-w-0">
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        members={allMembers}
        currentUserId={effectiveUser.id || effectiveUser._id}
      />
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onShare={handleShareCode}
      />
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
      {viewImage && (
        <ImageModal
          isOpen={true}
          onClose={() => setViewImage(null)}
          imageUrl={viewImage}
        />
      )}

      {/* Dynamic Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#060010]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-1 -ml-2 mr-1 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <Hash className="w-5 h-5 text-slate-400" />
          <div>
            <h2 className="font-semibold text-white tracking-wide">
              {activeRoom.title}
            </h2>
            <p className="text-xs text-slate-500 font-light hidden sm:block">
              {activeRoom.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-all duration-200 group"
            title="View Members"
          >
            <Users size={20} strokeWidth={1.5} />
          </button>
          <div className="relative" ref={optionsMenuRef}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${showOptionsMenu
                ? "bg-white/5 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>
            {showOptionsMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0514] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <a
                  href="https://github.com/ayush00git/TNC/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowOptionsMenu(false)}
                >
                  <AlertCircle size={16} className="text-red-400" />
                  Report an issue
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Message Stream */}
      <div
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        ref={scrollRef}
      >
        {/* Dynamic Welcome Message */}
        <div className="py-8 border-b border-white/5 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to #{activeRoom.title}!
          </h1>
          <p className="text-slate-400">
            This is the start of the{" "}
            <span className="text-indigo-400">{activeRoom.title}</span>{" "}
            conversation.
          </p>
        </div>

        {groupMessagesWithDates(messages).map((item, idx) => {
          // Handle date separator
          if (item.type === 'date-separator') {
            return (
              <div key={item.id} className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            );
          }

          // Handle regular message
          const msg = item;
          // Adjust user lookup for real data structure
          const user = msg.sender || {
            id: "unknown",
            _id: "unknown",
            name: "Unknown User",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown`,
          };

          // IMPORTANT: Check ID types (string vs number)
          const isMe = (user.id === effectiveUser.id || user._id === effectiveUser.id) && user.id !== "unknown";

          const groupedMessages = groupMessagesWithDates(messages);
          const prevItem = groupedMessages[idx - 1];
          const prevMsg = prevItem?.type === 'message' ? prevItem : null;

          // Check sender ID consistency
          const prevSenderId = prevMsg?.sender?.id || prevMsg?.sender?._id || prevMsg?.userId;
          const currentSenderId = user.id || user._id;
          const isSequence = prevMsg && prevSenderId === currentSenderId;

          const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || "User")}`;

          return (
            <div
              key={msg.id}
              className={`group flex gap-4 ${isSequence ? "mt-1" : "mt-6"
                } hover:bg-white/[0.02] -mx-4 px-4 py-1 rounded-lg transition-colors`}
            >
              {!isSequence ? (
                <div className="flex-shrink-0 mt-0.5">
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl bg-slate-800"
                  />
                </div>
              ) : (
                <div className="w-10 flex-shrink-0 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 text-right pt-2 select-none">
                  {msg.timestamp?.split(" ")[0]}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {!isSequence && (
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-medium ${isMe ? "text-indigo-400" : "text-slate-200"
                        }`}
                    >
                      {user.name} {isMe && <span className="opacity-50">(You)</span>}
                    </span>
                    {user.role && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1A1625] text-slate-400 border border-white/5">
                        {user.role}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-light ml-1">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
                {/* Check content vs text field */}
                {msg.type === "code" ? (
                  <div className="mt-2 bg-[#0A0514] border border-white/10 rounded-lg overflow-hidden">
                    <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                      <code>{msg.content || msg.text}</code>
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                    {msg.content || msg.text}
                  </p>
                )}
                {msg.image && (
                  <div className="mt-2">
                    <img
                      src={msg.image}
                      alt="uploaded content"
                      className="rounded-lg max-w-xs cursor-pointer"
                      onClick={() => setViewImage(msg.image as string)}
                    />
                  </div>
                )}
                {isMe && (
                  <div className="flex justify-end mt-1">
                    {msg.status === "sending" && (
                      <div className="flex space-x-0.5 animate-pulse">
                        <div className="w-1 h-1 bg-slate-500 rounded-full animation-delay-[0ms]" />
                        <div className="w-1 h-1 bg-slate-500 rounded-full animation-delay-[100ms]" />
                        <div className="w-1 h-1 bg-slate-500 rounded-full animation-delay-[200ms]" />
                      </div>
                    )}
                    {msg.status === "sent" && <Check className="w-3 h-3 text-slate-500" />}
                    {msg.status === "error" && <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Input Area */}
      <div className="px-6 pb-6 pt-2 bg-[#060010] relative">
        {imagePreviewUrl && (
          <div className="relative mb-2">
            <img
              src={imagePreviewUrl}
              alt="preview"
              className="rounded-lg max-w-xs h-24"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                setImagePreviewUrl(null);
              }}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="bg-[#0A0514] rounded-full border-2 border-white/5 focus-within:border-indigo-500/30 transition-colors p-2 flex items-center gap-2"
        >
          <div className="relative" ref={attachmentMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachmentMenu((prev) => !prev)}
              className={`
      p-2 rounded-full transition-all duration-300 ease-out cursor-pointer
      ${showAttachmentMenu
                  ? "bg-indigo-500/20 text-indigo-400 rotate-45"
                  : "text-slate-500 hover:text-indigo-400 hover:bg-white/5 rotate-0"
                }
    `}
            >
              <Plus size={20} strokeWidth={2} />
            </button>

            {showAttachmentMenu && (
              <div
                className="
      absolute bottom-full left-0 mb-3 w-48 
      bg-[#0A0514] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-20
      origin-bottom-left
      animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out
    "
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsCodeModalOpen(true);
                      setShowAttachmentMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors"
                  >
                    <Code size={18} className="text-indigo-400" />
                    <span>Code Snippet</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsImageModalOpen(true);
                      setShowAttachmentMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors"
                  >
                    <Image size={18} className="text-purple-400" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 py-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message #${activeRoom.title}`}
              className="w-full bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-600 font-light ml-2"
            />
          </div>

          <div className="flex items-center gap-1 pr-1 pb-1 relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Smile size={20} strokeWidth={1.5} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={(emojiData) => {
                    setMessageText((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                  width={320}
                  height={400}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={!messageText.trim() && !imagePreviewUrl}
              className={`
                p-2.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                ${messageText.trim() || imagePreviewUrl
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-y-0 hover:bg-indigo-500"
                  : "bg-[#1A1625] text-slate-600 translate-y-0 cursor-not-allowed"
                }
              `}
            >
              <ArrowUp
                size={20}
                strokeWidth={2.5}
                className={messageText.trim() || imagePreviewUrl ? "" : ""}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
