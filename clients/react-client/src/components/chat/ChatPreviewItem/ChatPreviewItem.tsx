// Package imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

// Custom imports
import Avatar from "../Avatar/Avatar";
import TokenService from "../../../service/token.service";
import { Chat, ChatParticipant, Message } from "../../../types/prisma";

// Styling
import "./ChatPreviewItem.scss";

interface IProps {
  selected?: boolean;
  onClick: () => void;
  chat: Chat;
}
/**
 * Check how many unread messages the user has in chat
 * @param messages
 * @param userId
 * @returns number
 */
const getUnreadCounter = (messages: Message[], userId: string) => {
  let unread = 0;

  // Iterate over every message and its message seen entries and check if seen
  messages.forEach((message) => {
    const i = message.MessageSeen.findIndex(
      (entry) => entry.ChatParticipant.userId === userId
    );
    if (i === -1) unread += 1;
  });

  return unread;
};

/**
 * Checks if all users have read a message
 * @param message
 * @param chatParticipants
 * @returns boolean
 */
const doubleTick = (message: Message, chatParticipants: ChatParticipant[]) => {
  return message.MessageSeen.length >= chatParticipants.length;
};

export default function ChatPreviewItem({
  selected = false,
  onClick,
  chat,
}: IProps) {
  // User and chat data
  const user = TokenService.getUser();
  let { ChatParticipant, avatar, name } = chat;

  // Get last message in Chat
  const lastMessage = chat.Message.length > 0 ? chat.Message[0] : null;

  // Get counter of unread messages
  const unreadCounter = getUnreadCounter(chat.Message, user.id);

  // Get Content of last message
  const content = lastMessage ? lastMessage.content : "";

  // Is last message from self
  const self = lastMessage
    ? lastMessage.ChatParticipant.User.id === user.id
    : false;

  // Timestamp of last message
  const timestamp = lastMessage
    ? new Date(lastMessage.createdAt).format("hh:MM")
    : "";

  // Create array of all chat users without self
  let participantsWithoutSelf: ChatParticipant[] = [];
  ChatParticipant.forEach((participant) => {
    if (user.id !== participant.User.id)
      participantsWithoutSelf.push(participant);
  });

  // Determine chat type
  const isGroupChat = participantsWithoutSelf.length > 1;
  const isSingleChat = participantsWithoutSelf.length === 0;
  const isNormalChat = participantsWithoutSelf.length === 1;

  let image = "";
  let nameTemp = "";

  if (isGroupChat) {
    image = avatar || "";
    nameTemp = name as string;
  }

  if (isNormalChat) {
    image = participantsWithoutSelf[0].User.avatar as string;
    nameTemp = participantsWithoutSelf[0].User.username;
  }

  if (isSingleChat) {
    image = user.avatar;
    nameTemp = chat.name as string;
  }

  return (
    <li
      className={"chat-preview-item-container " + (selected && "selected")}
      onClick={onClick}
    >
      <div className="main-container">
        <div className={"selected-marker " + (!selected && "hidden")}></div>
        <Avatar
          img={image}
          userId={isNormalChat ? participantsWithoutSelf[0].User.id : undefined}
        />
        <div className="content-container">
          <p className="username">{nameTemp}</p>
          <p className="message">
            {self && <span className="sender">Du: </span>}
            {isGroupChat && !self && (
              <span className="sender">
                {lastMessage?.ChatParticipant.User.username}:{" "}
              </span>
            )}
            <span>
              {content.length > 50 ? content.substr(0, 40) + "..." : content}
            </span>
          </p>
        </div>
      </div>
      <div className="detail-container">
        <div className="timestamp">
          {self && (
            <FontAwesomeIcon
              icon={
                doubleTick(lastMessage as Message, chat.ChatParticipant)
                  ? faCheckDouble
                  : faCheck
              }
            ></FontAwesomeIcon>
          )}
          <span>{timestamp}</span>
        </div>
        <span
          className={
            "unread-counter " + ((unreadCounter === 0 || selected) && "hidden")
          }
        >
          {unreadCounter}
        </span>
      </div>
    </li>
  );
}
