// Package imports
import { useContext } from "react";

// Custom imports
import { UserOnlineContext } from "../../../context/UserOnlineContext";
import { User } from "../../../types/prisma";

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
  userId: string;
  usersCounter: number;
}

export default function LastSeen({ userId, usersCounter }: IProps) {
  const userList = useContext(UserOnlineContext);

  // Set header content for single chat, group chat, or if user is online
  if (!userList.getUserMeta(userId) || usersCounter === 0) return <></>;
  if (usersCounter > 1) return <>{usersCounter} Mitglieder</>;
  if (userList.getUserMeta(userId)?.online) return <>Online</>;

  // Show lastseen timestamp or "Nie" if user was never online
  return (
    <>
      zul. online:{" "}
      {(userList.getUserMeta(userId) as User).lastSeen
        ? getReadableDate(
            (userList.getUserMeta(userId) as User).lastSeen as Date
          )
        : "Nie"}
    </>
  );
}
