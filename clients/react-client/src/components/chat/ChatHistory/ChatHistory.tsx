// Styling
import { useContext, useEffect, useRef } from "react";
import "./ChatHistory.scss";
import { ChatsContext } from "../../../context/ChatsContext";
import MessageBubble from "../MessageBubble/MessageBubble";
import TokenService from "../../../service/token.service";
import socket from "../../../service/socket.service";
import useWindowFocus from "../../../hooks/useWindowFocus";

export default function ChatHistory() {
  const { selectedChat, isPending, refetch } = useContext(ChatsContext);
  const focus = useWindowFocus();
  const lastMessage = useRef<HTMLDivElement>(null);
  const user = TokenService.getUser();

  const scrollToMessage = () => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToMessage();

    if (selectedChat && focus) {
      let setRead: string[] = [];

      // Check all messages if user has not seen them yet
      selectedChat.Message.forEach((message: any) => {
        const i = message.MessageSeen.findIndex(
          (ms: any) => ms.ChatParticipant.userId === user.id
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

  if (isPending) return <></>;
  if (selectedChat === null) return <></>;

  return (
    <div className="chat-history-container">
      {selectedChat.Message.toReversed().map((message: any) => {
        return (
          <MessageBubble
            key={message.id}
            message={message}
            participants={selectedChat.ChatParticipant}
            ref={lastMessage}
          />
        );
      })}
    </div>
  );
}
