// Package imports
import { useContext, useState } from "react";

// Custom imports
import TokenService from "../../../service/token.service";
import Avatar from "../Avatar/Avatar";
import { ChatsContext } from "../../../context/ChatsContext";
import { UserOnlineContext } from "../../../context/UserOnlineContext";
import LastSeen from "../LastSeen/LastSeen";

// Styling
import "./ChatHeader.scss";
import ChatDetailsMenu from "../ChatDetailsMenu/ChatDetailsMenu";

export default function ChatHeader() {
  const { selectedChat, isPending } = useContext(ChatsContext);
  const [chatDetailsMenu, setChatDetailsMenu] = useState(false);
  const userList = useContext(UserOnlineContext);
  let self = TokenService.getUser();

  // Show loading UI
  if (isPending)
    return (
      <div
        className="chat-header-container"
        onClick={() => setChatDetailsMenu(true)}
      >
        <div className="user-information">
          <Avatar loading={true} />
          <div className="user-meta">
            <div className="username loading"></div>
            <div className="last-seen loading"></div>
          </div>
        </div>
      </div>
    );

  // Show empty UI if no chat is selected
  if (selectedChat === null) return <></>;

  // Get userlist meta data and remove self
  let users = userList.getUsersMetaByParticipants(selectedChat.ChatParticipant);
  const index = users.findIndex((u) => u.id === self?.id);
  users = users.toSpliced(index, 1);

  // Determine chat type
  const isGroupChat = users.length > 1;
  const isSingleChat = users.length === 0;
  const isNormalChat = users.length === 1;

  let image = "";
  let nameTemp = "";

  // Set variables if groupchat
  if (isGroupChat) {
    image = selectedChat.avatar || "";
    nameTemp = selectedChat.name as string;
  }

  // Set variables if 1:1 chat
  if (isNormalChat) {
    image = users[0].avatar as string;
    nameTemp = users[0].username;
  }

  // Set variables if only one member
  if (isSingleChat) {
    image = self?.avatar || "";
    nameTemp = selectedChat.name as string;
  }

  return (
    <>
      <div
        className="chat-header-container"
        onClick={() => setChatDetailsMenu(true)}
      >
        <div className="user-information">
          <Avatar img={image} userId={isNormalChat ? users[0].id : undefined} />
          <div className="user-meta">
            <p className="username">{nameTemp}</p>
            <p className="last-seen">
              {users.length > 0 && (
                <LastSeen
                  userId={users[0].id}
                  usersCounter={users.length + 1}
                />
              )}
            </p>
          </div>
        </div>
      </div>
      {chatDetailsMenu && (
        <ChatDetailsMenu
          chat={selectedChat}
          close={() => setChatDetailsMenu(false)}
        />
      )}
    </>
  );
}
