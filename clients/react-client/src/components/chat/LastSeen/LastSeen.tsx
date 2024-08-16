import { useContext, useEffect, useState } from "react";
import { UserOnlineContext } from "../../../context/UserOnlineContext";

const getTimestamp = (date = new Date()) => {
  return new Date(date).getTime();
};

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

export default function LastSeen({
  userId,
  usersCounter,
}: {
  userId: string;
  usersCounter: number;
}) {
  const userList = useContext(UserOnlineContext);
  const [online, setOnline] = useState(false);
  const [onlineInterval, setOnlineInterval] = useState<any>(null);

  // Manage online live system
  useEffect(() => {
    const user = userList.getUserMeta(userId);

    // Check if user is online
    if (
      user &&
      getTimestamp() - getTimestamp(user.lastSeen) < 2000 &&
      onlineInterval === null &&
      usersCounter === 1
    ) {
      setOnline(true);

      // Check every
      const interval = setInterval(() => {
        if (user && getTimestamp() - getTimestamp(user.lastSeen) > 2000)
          setOnline(false);
      }, 1000);

      setOnlineInterval(interval);
    }
  }, [userList.users]);

  // Clear interval when offline again
  useEffect(() => {
    if (!online && onlineInterval && usersCounter === 1) {
      clearInterval(onlineInterval);
      setOnlineInterval(null);
    }
  }, [online]);

  if (!userList.getUserMeta(userId) || usersCounter === 0) return <></>;
  if (usersCounter > 1) return <>{usersCounter} Mitglieder</>;
  if (online) return <>Online</>;
  return (
    <>zul. online: {getReadableDate(userList.getUserMeta(userId).lastSeen)}</>
  );
}
