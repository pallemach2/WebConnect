// Package imports
import { useContext } from "react";

// Custom imports
import { UserOnlineContext } from "../../../context/UserOnlineContext";

// Styling
import "./Avatar.scss";

interface IProps {
  img?: string | null;
  loading?: boolean;
  onlineDot?: boolean;
  userId?: string;
}

export default function Avatar({
  img,
  loading = false,
  onlineDot,
  userId,
}: IProps) {
  const userList = useContext(UserOnlineContext);

  if (loading) return <div className="avatar loading"></div>;

  let showDot = false;
  if (onlineDot || (userId && userList.getUserMeta(userId)?.online)) {
    showDot = true;
  }

  if (img !== null)
    return (
      <div className="avatar">
        <img src={"http://localhost:4000/avatar/" + img} />
        {showDot && <div className="online-dot"></div>}
      </div>
    );

  return (
    <div className="avatar">
      {showDot && <div className="online-dot"></div>}
    </div>
  );
}
