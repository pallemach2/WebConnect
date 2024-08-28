// Package imports
import { useContext, useEffect, useRef } from "react";

// Custom imports
import { ChatsContext } from "../../../context/ChatsContext";
import MessageBubble from "../MessageBubble/MessageBubble";
import TokenService from "../../../service/token.service";
import socket from "../../../service/socket.service";
import useWindowFocus from "../../../hooks/useWindowFocus";

// Styling
import "./ChatHistory.scss";

export default function ChatHistory() {
  const { selectedChat, isPending, refetch } = useContext(ChatsContext);
  const focus = useWindowFocus();
  const lastMessage = useRef<HTMLDivElement>(null);
  const user = TokenService.getUser();

  // Scroll down to newest message
  const scrollToMessage = () => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  };

  // Set read to all unread messages for focused chat
  useEffect(() => {
    scrollToMessage();

    if (selectedChat && focus) {
      let setRead: string[] = [];

      // Check all messages if user has not seen them yet
      selectedChat.Message.forEach((message) => {
        const i = message.MessageSeen.findIndex(
          (ms: any) => ms.ChatParticipant.userId === user?.id
        );

        if (i === -1) setRead.push(message.id);
      });

      if (setRead.length > 0) {
        socket.emit("message-seen", { messageIds: setRead }, () => {
          refetch();
        });
      }
    }
  }, [selectedChat, focus]);

  // Show Loading UI
  if (isPending)
    return (
      <div className="chat-history-container">
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
        <div className={"message-container " + (Math.random() > 0.5 && "self")}>
          <div
            className="message-bubble loading"
            style={{
              height: 60 + Math.random() * 100,
              width: 200 + Math.random() * 100,
            }}
          ></div>
        </div>
      </div>
    );

  // Show empty UI if no chat selected
  if (selectedChat === null) return <></>;

  // Reverse Messages to print them easier
  const sortedMessages = selectedChat.Message.toReversed();

  return (
    <div className="chat-history-container">
      {sortedMessages.map((message, key) => {
        return (
          <MessageBubble
            key={message.id}
            message={message}
            nextMessage={sortedMessages[key + 1] || null}
            previousMessage={sortedMessages[key - 1] || null}
            participants={selectedChat.ChatParticipant}
            ref={lastMessage}
          />
        );
      })}
    </div>
  );
}
