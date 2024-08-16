import ChatHeader from "../ChatHeader/ChatHeader";
import ChatHistory from "../ChatHistory/ChatHistory";
import NewMessageBar from "../NewMessageBar/NewMessageBar";
import "./ChatWindow.scss";

export default function ChatWindow() {
  // Hooks
  return (
    <div className="chat-window-container">
      <ChatHeader />
      <ChatHistory />
      <NewMessageBar />
    </div>
  );
}
