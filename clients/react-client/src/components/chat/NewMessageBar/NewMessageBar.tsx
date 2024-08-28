// Package imports
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Custom imports
import socket from "../../../service/socket.service";
import { ChatsContext } from "../../../context/ChatsContext";

// Styling
import "./NewMessageBar.scss";

export default function NewMessageBar() {
  const [content, setContent] = useState("");
  const { selectedChat, refetch } = useContext(ChatsContext);

  const sendMessage = () => {
    if (content !== "" && selectedChat) {
      socket.emit("message-new", { chatId: selectedChat.id, content }, () => {
        // TODO: implement message without refetching
        refetch();
      });

      // Reset field value
      setContent("");
    }
  };

  return (
    <div className="new-message-bar-container">
      <div className="input-container">
        <input
          type="textfield"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
