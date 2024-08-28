// Package imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useState } from "react";

// Custom imports
import TokenService from "../../../service/token.service";
import MessageContextMenu from "../MessageContextMenu/MessageContextMenu";
import { ChatParticipant, Message } from "../../../types/prisma";

// Styling
import "./MessageBubble.scss";

interface IProps {
  message: Message;
  nextMessage: Message | null;
  previousMessage: Message | null;
  participants: ChatParticipant[];
}

/**
 * Checks if all users have read a message
 * @param message
 * @param chatParticipants
 * @returns boolean
 */
const doubleTick = (message: Message, chatParticipants: ChatParticipant[]) => {
  return message.MessageSeen.length >= chatParticipants.length;
};

// React Component with a forwarded ref
const MessageBubble = forwardRef<HTMLDivElement, IProps>(
  ({ message, nextMessage, previousMessage, participants }, ref) => {
    // Set states for context menu position aned open state
    const [contextMenuPosition, setContextMenuPosition] = useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState<boolean>(false);

    // Get User and find if message is from self
    const user = TokenService.getUser();
    const self = message.ChatParticipant.User.id === user.id;

    // Check if message date is at the same day as the message before
    let sameDayAsPrevious = true;
    if (previousMessage) {
      sameDayAsPrevious =
        new Date(previousMessage.createdAt).format("dd.mm.yyyy") ===
        new Date(message.createdAt).format("dd.mm.yyyy");
    }

    // Check if message date is at the same day as the message after
    let sameDayAsAfter = true;
    if (nextMessage) {
      sameDayAsAfter =
        new Date(nextMessage.createdAt).format("dd.mm.yyyy") ===
        new Date(message.createdAt).format("dd.mm.yyyy");
    }

    // Check if next message is within 60 seconds
    let nextImmediate = false;
    if (sameDayAsAfter && nextMessage) {
      nextImmediate =
        new Date(nextMessage.createdAt).getTime() -
          new Date(message.createdAt).getTime() <
        60000;
    }

    // Check if next message is from same creator
    let nextIsSameCreator = false;
    if (nextMessage) {
      nextIsSameCreator =
        nextMessage.ChatParticipant.User.id === message.ChatParticipant.User.id;
    }

    return (
      <>
        {!sameDayAsPrevious && (
          <div className="date-divider">
            <span>{new Date(message.createdAt).format("dd. Z yyyy")}</span>
          </div>
        )}
        <div className={"message-container " + (self && "self")} ref={ref}>
          <div
            className="message-bubble"
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuPosition({ x: e.pageX, y: e.pageY });
              setContextMenu(true);
            }}
          >
            <span>{message.content}</span>
            <div className="message-details">
              <div className="message-flags">
                {message.edited && (
                  <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
                )}
                {self && (
                  <FontAwesomeIcon
                    icon={
                      doubleTick(message, participants)
                        ? faCheckDouble
                        : faCheck
                    }
                  ></FontAwesomeIcon>
                )}
              </div>
              <span className="message-timestamp">
                {new Date(message.createdAt).format("hh:MM")}
              </span>
            </div>
          </div>
        </div>
        {contextMenu && (
          <MessageContextMenu
            close={() => setContextMenu(false)}
            position={contextMenuPosition}
            message={message}
            participantsCounter={participants.length}
          />
        )}
        {!nextImmediate && sameDayAsAfter && nextMessage && (
          <div className="message-spacer"></div>
        )}
      </>
    );
  }
);

export default MessageBubble;
