// Package imports
import { useContext, useState } from "react";

// Custom imports
import ButtonInput from "../../form/ButtonInput/ButtonInput";
import socket from "../../../service/socket.service";
import { ChatsContext } from "../../../context/ChatsContext";
import { Message } from "../../../types/prisma";

// Styling
import "./EditMenu.scss";

interface IProps {
  message: Message;
  close: () => void;
}

export default function EditMenu({ message, close }: IProps) {
  const [value, setValue] = useState<string>(message.content);
  const { refetch } = useContext(ChatsContext);

  // Close the menu on background click
  const closeMenu = (e: any) => {
    if (e.target.classList.contains("edit-menu-bg")) {
      close();
    }
  };

  // Save new message content
  const save = () => {
    if (value !== "") {
      socket.emit(
        "message-edit",
        { messageId: message.id, content: value },
        () => {
          close();
          refetch();
        }
      );
    }
  };

  return (
    <div className="edit-menu-bg" onClick={closeMenu}>
      <div className="edit-menu-container">
        <p>Nachricht bearbeiten</p>
        <textarea
          autoFocus={true}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <div className="action-container">
          <ButtonInput type="secondary" label="Abbrechen" onClick={close} />
          <ButtonInput type="primary" label="Speichern" onClick={save} />
        </div>
      </div>
    </div>
  );
}
