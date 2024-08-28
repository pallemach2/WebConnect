// Package imports
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useMemo, useState } from "react";

// Custom imports
import ApiService from "../service/api.service";
import socket from "../service/socket.service";
import { ChatParticipant, User } from "../types/prisma";

const getTimestamp = (date = new Date()) => {
  return new Date(date).getTime();
};

interface IUserOnlineContext {
  isPending: boolean;
  users: User[];
  refetch: () => void;
  getUserMeta: (id: string) => User | null;
  getUsersMetaByParticipants: (cp: ChatParticipant[]) => User[];
}

export const UserOnlineContext = createContext<IUserOnlineContext>({
  isPending: true,
  users: [],
  refetch: () => {},
  getUserMeta: () => null,
  getUsersMetaByParticipants: () => [],
});

export function UserOnlineProvider({ children }: any) {
  // Hooks
  const [users, setUsers] = useState<User[]>([]);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: ApiService.fetchUserList,
    placeholderData: [],
    retry: 2,
  });

  /**
   * Return user with details by an ID
   * @param id
   * @returns
   */
  const getUserMeta = (id: string) => {
    const res = users.find((u) => u.id === id);

    return res ? res : null;
  };

  /**
   * Returns a list of all users with their details, based on Participant input
   * @param cp
   * @returns
   */
  const getUsersMetaByParticipants = (cp: ChatParticipant[]) => {
    const foundUsers: User[] = [];

    cp.forEach((p) => {
      if (p.User) {
        const foundUser = getUserMeta(p.User.id);

        if (foundUser) foundUsers.push(foundUser);
      }
    });

    return foundUsers;
  };

  // Memo context value
  const contextValue = useMemo(
    () => ({
      isPending: usersQuery.isPending,
      refetch: usersQuery.refetch,
      users,
      getUserMeta,
      getUsersMetaByParticipants,
    }),
    [usersQuery.isPending, usersQuery.refetch, users]
  );

  // Update state when new api data arrives
  useEffect(() => {
    if (usersQuery.status === "success") {
      let data: User[] = [];

      usersQuery.data.forEach((u: User) => {
        data.push({
          ...u,
          online: u.lastSeen
            ? getTimestamp() - getTimestamp(u.lastSeen) < 2000
            : false,
        });
      });

      setUsers(data);
    }
  }, [usersQuery.status, usersQuery.data]);

  // Set users to offline after some seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      let updatedUsers = users;
      let update = false;

      updatedUsers.forEach((u, key) => {
        if (u.online) {
          update = true;
          updatedUsers[key].online = updatedUsers[key].lastSeen
            ? getTimestamp() - getTimestamp(updatedUsers[key].lastSeen) < 2000
            : false;
        }
      });

      if (update) setUsers([...updatedUsers]);
    }, 5000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [users]);

  // Register events
  useEffect(() => {
    // Only update lastSeen timestamp when user-online message arrives
    socket.on("user-online", (data: any) => {
      let index = users.findIndex((u: any) => u.id === data.userId);

      if (index !== -1) {
        const updatedUsers = users;
        updatedUsers[index].lastSeen = data.lastSeen;
        updatedUsers[index].online = updatedUsers[index].lastSeen
          ? getTimestamp() - getTimestamp(updatedUsers[index].lastSeen) < 2000
          : false;

        setUsers([...updatedUsers]);
      }
    });

    return () => {
      socket.off("user-online");
    };
  }, [users]);

  return (
    <UserOnlineContext.Provider value={contextValue}>
      {children}
    </UserOnlineContext.Provider>
  );
}
