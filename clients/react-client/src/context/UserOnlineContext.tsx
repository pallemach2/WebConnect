import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useMemo, useState } from "react";
import ApiService from "../service/api.service";
import socket from "../service/socket.service";

export const UserOnlineContext = createContext<any>({
  isPending: true,
  users: [],
  refetch: () => {},
  getUserMeta: () => {},
  getUsersMetaByParticipants: () => {},
});

export function UserOnlineProvider({ children }: any) {
  // Hooks
  const [users, setUsers] = useState<any[]>([]);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: ApiService.fetchUserList,
    placeholderData: [],
    retry: 2,
  });

  const getUserMeta = (id: string) => {
    return users.find((u: any) => u.id === id);
  };

  const getUsersMetaByParticipants = (cp: any) => {
    const foundUsers: any = [];
    cp.forEach((p: any) => {
      const foundUser = getUserMeta(p.User.id);

      if (foundUser) foundUsers.push(foundUser);
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
      setUsers(usersQuery.data);
    }
  }, [usersQuery.status, usersQuery.data]);

  // Register events
  useEffect(() => {
    // Only update lastSeen timestamp when user-online message arrives
    socket.on("user-online", (data: any) => {
      let index = users.findIndex((u: any) => u.id === data.userId);

      if (index !== -1) {
        const updatedUsers = users;
        updatedUsers[index].lastSeen = data.lastSeen;

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
