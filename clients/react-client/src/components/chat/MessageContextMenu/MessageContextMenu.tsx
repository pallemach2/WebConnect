import useWindowDimensions from "../../../hooks/useWindowDimensions";
import ButtonInput from "../../form/ButtonInput/ButtonInput";
import "./MessageContextMenu.scss";
import TokenService from "../../../service/token.service";
import {
  faCheck,
  faCheckDouble,
  faCopy,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatsContext } from "../../../context/ChatsContext";
import socket from "../../../service/socket.service";

const getReadableDate = (date = new Date(), format = "hh:MM") => {
  const dateObj = new Date(date);

  if (
    dateObj.getDay() !== new Date().getDay() ||
    dateObj.getMonth() !== new Date().getMonth() ||
    dateObj.getFullYear() !== new Date().getFullYear()
  ) {
    return new Date(date).format("dd.mm.yyyy um hh:MM");
  }
  return new Date(date).format(format);
};

export default function MessageContextMenu({
  close,
  message,
  position,
  participantsCounter,
}: {
  close: Function;
  message: any;
  participantsCounter: number;
  position: {
    x: number;
    y: number;
  };
}) {
  const [x, setX] = useState(-100000);
  const [y, setY] = useState(-100000);
  const { refetch } = useContext(ChatsContext);
  const { height, width } = useWindowDimensions();
  const ref = useRef<HTMLDivElement>(null);
  const user = TokenService.getUser();
  const self = message.ChatParticipant.User.id === user.id;

  const closeAction = (e: any) => {
    if (e.target.classList.contains("message-context-menu-bg")) close();
  };

  const copyAction = () => {
    navigator.clipboard.writeText(message.content);
    close();
  };

  const editAction = () => {};

  const deleteAction = () => {
    const res = confirm("Sicher das Sie die Nachricht löschen wollen?");

    if (res) {
      socket.emit("message-delete", { messageId: message.id }, () => {
        // TODO: implement message without refetching
        refetch();
        close();
      });
    }
  };

  // Set position of context menu
  useEffect(() => {
    const containerHeight = ref.current?.offsetHeight || 0;
    const containerWidth = ref.current?.offsetWidth || 0;

    let x = position.x;
    if (position.x + containerWidth > width) x = position.x - containerWidth;

    let y = position.y;
    if (position.y + containerHeight > height) y = position.y - containerHeight;

    setX(x);
    setY(y);
  }, [ref.current, width, height]);

  return (
    <div className="message-context-menu-bg" onClick={closeAction}>
      <div
        className="message-context-menu"
        style={{ left: x, top: y }}
        ref={ref}
      >
        {self && (
          <ReadBy
            messageSeen={message.MessageSeen}
            participantsCounter={participantsCounter}
          />
        )}
        <div className="actions-container">
          {self && (
            <ButtonInput
              type="secondary"
              label={
                <>
                  <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
                  bearbeiten
                </>
              }
              onClick={() => {}}
            />
          )}
          <ButtonInput
            type="secondary"
            label={
              <>
                <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
                kopieren
              </>
            }
            onClick={copyAction}
          />
          {self && (
            <ButtonInput
              type="secondary"
              label={
                <>
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  löschen
                </>
              }
              onClick={deleteAction}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const ReadBy = ({ messageSeen, participantsCounter }: any) => {
  const user = TokenService.getUser();

  if (participantsCounter === 2) {
    if (messageSeen.length >= 2) {
      const readTimestamp = messageSeen.find(
        (ms: any) => ms.userId !== user.id
      );

      return (
        <div className="readby-container">
          <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
          <span className="readby-text">
            gesehen: {getReadableDate(readTimestamp.timestamp)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="readby-container">
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
          <span className="readby-text">Noch nicht gesehen</span>
        </div>
      );
    }
  } else {
    return (
      <div className="readby-container">
        <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
        <span className="readby-text">
          {messageSeen.length} von {participantsCounter}
        </span>
      </div>
    );
  }
};
