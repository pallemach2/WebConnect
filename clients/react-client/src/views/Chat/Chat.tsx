// Package imports
import { useContext, useEffect } from "react";

// Custom imports
import Sidebar from "../../components/chat/Sidebar/Sidebar";
import ChatWindow from "../../components/chat/ChatWindow/ChatWindow";
import Socket from "../../service/socket.service";
import { ChatsContext } from "../../context/ChatsContext";

// Styling
import "./Chat.scss";
import useWindowFocus from "../../hooks/useWindowFocus";

function Chat() {
  // Hooks
  const chats = useContext(ChatsContext);
  const focus = useWindowFocus();

  // Connect socket
  useEffect(() => {
    Socket.connect();

    return () => {
      Socket.disconnect();
    };
  }, []);

  if (chats.isPending) return <></>;

  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Chat;
