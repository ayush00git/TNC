import RoomSidebar from '../components/RoomSidebar';
import ChatWindow from '../components/ChatWindow';

export default function ChatInterface() {
  return (
    <div className="flex h-screen w-full bg-[#060010] overflow-hidden">
      <RoomSidebar />
      <ChatWindow />
    </div>
  );
}