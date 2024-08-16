import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TokenService from "../../../service/token.service";
import "./MessageBubble.scss";
import {
  faCheck,
  faCheckDouble,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import MessageContextMenu from "../MessageContextMenu/MessageContextMenu";

interface IProps {
  message: any;
  participants: any;
}

/**
 * Checks if all users have read a message
 * @param message
 * @param chatParticipants
 * @returns boolean
 */
const doubleTick = (message: any, chatParticipants: any) => {
  return message.MessageSeen.length >= chatParticipants.length;
};

const MessageBubble = forwardRef(function MessageBubble(
  { message, participants }: IProps,
  ref: any
) {
  const [contextMenu, setContextMenu] = useState(false);
  const user = TokenService.getUser();
  let self = message.ChatParticipant.User.id === user.id;

  return (
    <div className={"message-container " + (self && "self")} ref={ref}>
      <div
        className="message-bubble"
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu(true);
        }}
      >
        {message.content}
      </div>
      <div className="message-details">
        <div className="message-flags">
          {message.edited && (
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
          )}
          {self && (
            <FontAwesomeIcon
              icon={doubleTick(message, participants) ? faCheckDouble : faCheck}
            ></FontAwesomeIcon>
          )}
        </div>
        <span className="message-timestamp">
          {new Date(message.createdAt).format("hh:MM")}
        </span>
      </div>
      {contextMenu && (
        <MessageContextMenu close={() => setContextMenu(false)} />
      )}
    </div>
  );
});

export default MessageBubble;
