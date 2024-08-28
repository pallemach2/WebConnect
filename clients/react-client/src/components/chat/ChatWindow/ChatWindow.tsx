// Custom imports
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatHistory from "../ChatHistory/ChatHistory";
import NewMessageBar from "../NewMessageBar/NewMessageBar";

// Styling
import "./ChatWindow.scss";

export default function ChatWindow() {
  return (
    <div className="chat-window-container">
      <ChatHeader />
      <ChatHistory />
      <NewMessageBar />
    </div>
  );
}
