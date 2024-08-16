// Package imports
import { useContext } from "react";
import ChatPreviewItem from "../ChatPreviewItem/ChatPreviewItem";
import SidebarActions from "../SidebarActions/SidebarActions";
import { ChatsContext } from "../../../context/ChatsContext";

// Styling
import "./Sidebar.scss";

export default function Sidebar() {
  const chats = useContext(ChatsContext);

  if (chats.isPending) return <>Loading</>;

  return (
    <div className="sidebar-container">
      <SidebarActions />
      <ul className="chat-preview-list">
        {chats.chats
          .toSorted(
            (c1: any, c2: any) =>
              new Date(c2.Message[0].createdAt).getTime() -
              new Date(c1.Message[0].createdAt).getTime()
          )
          .map((chat: any) => {
            return (
              <ChatPreviewItem
                key={chat.id}
                chat={chat}
                selected={chat.id === chats.selectedChat.id}
                onClick={() => chats.setSelectedChatById(chat.id)}
              />
            );
          })}
      </ul>
    </div>
  );
}
