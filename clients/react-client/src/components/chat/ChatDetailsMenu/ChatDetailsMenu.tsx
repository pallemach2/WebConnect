import { useContext, useState } from "react";
import { Chat } from "../../../types/prisma";
import "./ChatDetailsMenu.scss";
import { UserOnlineContext } from "../../../context/UserOnlineContext";
import Avatar from "../Avatar/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faImage,
  faPencil,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import socket from "../../../service/socket.service";
import { ChatsContext } from "../../../context/ChatsContext";
import { useMutation } from "@tanstack/react-query";
import ApiService from "../../../service/api.service";

/**
 * Creates a readable string from date object
 * @param date
 * @param format
 * @returns
 */
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

interface IProps {
  chat: Chat;
  close: () => void;
}

export default function ChatDetailsMenu({ chat, close }: IProps) {
  const userList = useContext(UserOnlineContext);

  // Close the menu on background click
  const closeMenu = (e: any) => {
    if (e.target.classList.contains("chat-details-menu-bg")) {
      close();
    }
  };

  return (
    <div className="chat-details-menu-bg" onClick={closeMenu}>
      <div className="chat-details-menu-container">
        <GroupAvatarContainer
          chatId={chat.id}
          src={chat.avatar || "clzmp4jk80000nudqn6vmauc4.jpg"}
        />
        <div className="title-container">
          <GroupTitleContainer
            chatId={chat.id}
            name={chat.name || ""}
            memberCount={chat.ChatParticipant.length}
          />
        </div>
        <ul className="members">
          {chat.ChatParticipant.map((cp) => {
            const user = userList.getUserMeta(cp.User.id);

            return (
              <li>
                <Avatar img={user?.avatar} userId={user?.id} />
                <div className="basic-information">
                  <span className="username">
                    <span>{cp.User.username}</span>
                    {cp.creator && <span className="creator">Inhaber</span>}
                  </span>
                  <span className="online">
                    {user?.online
                      ? "Online"
                      : user?.lastSeen
                        ? "zul. online: " +
                          getReadableDate(new Date(user?.lastSeen))
                        : "zul. online: Nie"}
                  </span>
                </div>
                <div className="actions"></div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

interface IGroupAvatarContainerProps {
  chatId: string;
  src: string;
}

const GroupAvatarContainer = ({ src, chatId }: IGroupAvatarContainerProps) => {
  const { refetch } = useContext(ChatsContext);

  const avatarUpload = useMutation({
    mutationFn: (file: any) => {
      return ApiService.changeGroupAvatar(chatId, file);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      avatarUpload.mutate(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("file")?.click();
  };

  return (
    <>
      <img src={"http://localhost:4000/avatar/" + src} />
      <input id="file" type="file" onChange={handleFileChange} />
      <button className="change-avatar" onClick={triggerFileSelect}>
        <FontAwesomeIcon icon={faImage} />
      </button>
    </>
  );
};

interface IGroupTitleContainerProps {
  chatId: string;
  name: string;
  memberCount: number;
}

const GroupTitleContainer = ({
  chatId,
  name,
  memberCount,
}: IGroupTitleContainerProps) => {
  const { refetch } = useContext(ChatsContext);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [value, setValue] = useState(name);

  const save = () => {
    if (value !== "") {
      socket.emit("chat-edit", { chatId, name: value }, () => {
        refetch();
        setEditNameOpen(false);
      });
    }
  };

  if (editNameOpen) {
    return (
      <>
        <span className="name">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="edit-name action" onClick={save}>
            <FontAwesomeIcon icon={faFloppyDisk} />
          </button>
          <button
            className="edit-name action"
            onClick={() => {
              setEditNameOpen(false);
              setValue(name);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </span>
        <span className="members-counter">{memberCount} Mitglieder</span>
      </>
    );
  }

  return (
    <>
      <span className="name">
        {value}
        <button className="edit-name" onClick={() => setEditNameOpen(true)}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </span>
      <span className="members-counter">{memberCount} Mitglieder</span>
    </>
  );
};
