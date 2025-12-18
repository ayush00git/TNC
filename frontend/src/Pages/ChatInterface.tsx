import RoomSidebar from "../components/RoomSidebar";
import ChatWindow from "../components/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatInterface() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="flex h-screen w-full bg-[#060010] overflow-hidden">
      <RoomSidebar />
      <ChatWindow roomId={roomId} />
    </div>
  );
}
