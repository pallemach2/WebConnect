// Package imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

// Styling
import "./ChatPreviewItem.scss";
import Avatar from "../Avatar/Avatar";
import TokenService from "../../../service/token.service";

interface IProps {
  selected?: boolean;
  onClick: Function;
  chat: any;
}
/**
 * Check how many unread messages the user has in chat
 * @param messages
 * @param userId
 * @returns number
 */
const getUnreadCounter = (messages: any, userId: string) => {
  let unread = 0;

  messages.forEach((message: any) => {
    const i = message.MessageSeen.findIndex(
      (entry: any) => entry.ChatParticipant.userId === userId
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
const doubleTick = (message: any, chatParticipants: any) => {
  return message.MessageSeen.length >= chatParticipants.length - 1;
};

export default function ChatPreviewItem({
  selected = false,
  onClick,
  chat,
}: IProps) {
  // Get Template data
  const user = TokenService.getUser();
  const lastMessage = chat.Message.length > 0 ? chat.Message[0] : null;
  const unreadCounter = getUnreadCounter(chat.Message, user.id);
  const content = lastMessage ? lastMessage.content : "";
  const self = lastMessage
    ? lastMessage.ChatParticipant.User.id === user.id
    : false;
  const timestamp = lastMessage
    ? lastMessage.createdAt !== ""
      ? new Date(lastMessage.createdAt).format("hh:MM")
      : ""
    : "";

  let { ChatParticipant, avatar, name } = chat;
  let participantsWithoutSelf: any[] = [];

  ChatParticipant.forEach((participant: any) => {
    if (user.id !== participant.User.id)
      participantsWithoutSelf.push(participant);
  });

  const isGroupChat = participantsWithoutSelf.length > 1;
  const isSingleChat = participantsWithoutSelf.length === 0;
  const isNormalChat = participantsWithoutSelf.length === 1;

  let image = "";
  let nameTemp = "";

  if (isGroupChat) {
    image = avatar || "";
    nameTemp = name;
  }

  if (isNormalChat) {
    image = participantsWithoutSelf[0].User.avatar;
    nameTemp = participantsWithoutSelf[0].User.username;
  }

  if (isSingleChat) {
    image = user.avatar;
    nameTemp = chat.name;
  }

  return (
    <li
      className={"chat-preview-item-container " + (selected && "selected")}
      onClick={() => onClick()}
    >
      <div className="main-container">
        <div className={"selected-marker " + (!selected && "hidden")}></div>
        <Avatar img={image} />
        <div className="content-container">
          <p className="username">{nameTemp}</p>
          <p className="message">
            {self && <span className="sender">Du: </span>}
            <span>
              {content.length > 50 ? content.substr(0, 50) + " ..." : content}
            </span>
          </p>
        </div>
      </div>
      <div className="detail-container">
        <div className="timestamp">
          {self && (
            <FontAwesomeIcon
              icon={
                doubleTick(lastMessage, chat.ChatParticipant)
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
