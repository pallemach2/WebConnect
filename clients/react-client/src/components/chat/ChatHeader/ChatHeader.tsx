// Package imports
import { useContext } from "react";

// Custom imports
import TokenService from "../../../service/token.service";
import Avatar from "../Avatar/Avatar";
import { ChatsContext } from "../../../context/ChatsContext";
import { UserOnlineContext } from "../../../context/UserOnlineContext";

// Styling
import "./ChatHeader.scss";
import LastSeen from "../LastSeen/LastSeen";

export default function ChatHeader() {
  const { selectedChat, isPending } = useContext(ChatsContext);
  const userList = useContext(UserOnlineContext);
  let self = TokenService.getUser();

  if (isPending) return <></>;
  if (selectedChat === null) return <></>;

  // Get userlist meta data and remove self
  let users = userList.getUsersMetaByParticipants(selectedChat.ChatParticipant);
  const index = users.findIndex((u: any) => u.id === self.id);
  users = users.splice(index - 1, 1);

  const isGroupChat = users.length > 1;
  const isSingleChat = users.length === 0;
  const isNormalChat = users.length === 1;

  let image = "";
  let nameTemp = "";

  // Set variables if groupchat
  if (isGroupChat) {
    image = selectedChat.avatar || "";
    nameTemp = selectedChat.name;
  }

  // Set variables if 1:1 chat
  if (isNormalChat) {
    image = users[0].avatar;
    nameTemp = users[0].username;
  }

  // Set variables if only one member
  if (isSingleChat) {
    image = self.avatar;
    nameTemp = selectedChat.name;
  }

  return (
    <div className="chat-header-container">
      <div className="user-information">
        <Avatar img={image} />
        <div className="user-meta">
          <p className="username">{nameTemp}</p>
          <p className="last-seen">
            <LastSeen userId={users[0].id} usersCounter={users.length} />
          </p>
        </div>
      </div>
    </div>
  );
}
