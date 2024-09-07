// Package imports
import { FormEvent, useContext, useState } from "react";

// Custom imports
import TextInput from "../../form/TextInput/TextInput";
import SubmitButtonInput from "../../form/SubmitButtonInput/SubmitButtonInput";
import MessageBox from "../../form/MessageBox/MessageBox";
import socket from "../../../service/socket.service";
import { ChatsContext } from "../../../context/ChatsContext";
import ButtonInput from "../../form/ButtonInput/ButtonInput";

// Styling
import "./NewChatMenu.scss";

interface IProps {
  close: () => void;
}

export default function NewChatMenu({ close }: IProps) {
  // Chat context
  const chats = useContext(ChatsContext);

  // Input and message states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // Create new chat with socket connection
  const newChat = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("chat-new", { name: name, users: [username] }, (d: any) => {
      if (d) {
        setMessage("Nutzer konnte nicht gefunden werden.");
      } else {
        chats.refetch();
        close();
      }
    });
  };

  return (
    <div className="new-chat-menu">
      <p>Chat erstellen</p>
      {message !== "" && <MessageBox type={"error"} message={message} />}
      <form onSubmit={newChat}>
        <TextInput label="Chat Name" value={name} onChange={setName} />
        <TextInput label="Benutzer" value={username} onChange={setUsername} />
        <div className="action-container">
          <ButtonInput type="secondary" label="Abbrechen" onClick={close} />
          <SubmitButtonInput type="primary" label="Chat erstellen" />
        </div>
      </form>
    </div>
  );
}
