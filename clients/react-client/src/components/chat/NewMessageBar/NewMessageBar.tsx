import { useContext, useState } from "react";
import "./NewMessageBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import socket from "../../../service/socket.service";
import { ChatsContext } from "../../../context/ChatsContext";

export default function NewMessageBar() {
  const [content, setContent] = useState("");
  const { selectedChat, refetch } = useContext(ChatsContext);

  const sendMessage = () => {
    if (content !== "") {
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
