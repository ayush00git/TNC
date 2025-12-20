import React from "react";
import RoomSidebar from "../components/RoomSidebar";
import ChatWindow from "../components/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatInterface() {
  const { roomId } = useParams<{ roomId: string }>();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-[#060010] overflow-hidden">
      <RoomSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <ChatWindow
        roomId={roomId}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
      />
    </div>
  );
}
