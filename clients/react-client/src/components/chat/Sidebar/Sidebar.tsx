// Package imports
import { useContext, useState } from "react";

// Custom imports
import ChatPreviewItem from "../ChatPreviewItem/ChatPreviewItem";
import SidebarActions from "../SidebarActions/SidebarActions";
import { ChatsContext } from "../../../context/ChatsContext";
import Avatar from "../Avatar/Avatar";
import { Chat } from "../../../types/prisma";

// Styling
import "./Sidebar.scss";

export default function Sidebar() {
  // Chats context
  const chats = useContext(ChatsContext);

  // Input value
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Returns list of chats in right order with search term applied
   * @returns
   */
  const getChatsList = () => {
    // Return all chats ordered by timestamp of last message
    if (searchTerm === "")
      return chats.chats.toSorted((c1, c2) => {
        const c1Value = c1.Message.length > 0 ? c1.Message[0].createdAt : c1.createdAt;
        const c2Value = c2.Message.length > 0 ? c2.Message[0].createdAt : c2.createdAt;

        return new Date(c2Value).getTime() - new Date(c1Value).getTime();
      });

    let results: Chat[] = [];
    const regex = new RegExp(searchTerm, "gi");

    chats.chats.forEach((chat) => {
      if (regex.test(chat.name || "")) {
        results.push(chat);
        return;
      }

      chat.ChatParticipant.forEach((cp) => {
        if (regex.test(cp.User.username)) {
          results.push(chat);
          return;
        }
      });
    });

    return results;
  };

  // Content Loader
  if (chats.isPending)
    return (
      <div className="sidebar-container">
        <SidebarActions setSearchTerm={setSearchTerm} />
        <ul className="chat-preview-list">
          <li className={"chat-preview-item-container"}>
            <div className="main-container">
              <div className={"selected-marker hidden"}></div>
              <Avatar loading={true} />
              <div className="content-container">
                <div className="username loading"></div>
                <div className="message loading"></div>
              </div>
            </div>
          </li>
          <li className={"chat-preview-item-container"}>
            <div className="main-container">
              <div className={"selected-marker hidden"}></div>
              <Avatar loading={true} />
              <div className="content-container">
                <div className="username loading"></div>
                <div className="message loading"></div>
              </div>
            </div>
          </li>
          <li className={"chat-preview-item-container"}>
            <div className="main-container">
              <div className={"selected-marker hidden"}></div>
              <Avatar loading={true} />
              <div className="content-container">
                <div className="username loading"></div>
                <div className="message loading"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );

  return (
    <div className="sidebar-container">
      <SidebarActions setSearchTerm={setSearchTerm} />
      <ul className="chat-preview-list">
        {getChatsList().map((chat) => {
          return (
            <ChatPreviewItem
              key={chat.id}
              chat={chat}
              selected={chat.id === chats.selectedChat?.id}
              onClick={() => chats.setSelectedChatById(chat.id)}
            />
          );
        })}
      </ul>
    </div>
  );
}
