// Package imports
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

// Custom imports
import ApiService from "../service/api.service";
import socket from "../service/socket.service";
import { Chat } from "../types/prisma";

interface IChatsContext {
  isPending: boolean;
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChatById: (id: string) => void;
  refetch: () => void;
}

// Create Context
export const ChatsContext = createContext<IChatsContext>({
  isPending: true,
  chats: [],
  setChats: () => {},
  selectedChat: null,
  setSelectedChatById: () => {},
  refetch: () => {},
});

export function ChatProvider({ children }: any) {
  // Hooks
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const chatsQuery = useQuery({
    queryKey: ["chats"],
    queryFn: ApiService.fetchChats,
    placeholderData: [],
    retry: 2,
  });

  const setSelectedChatById = (id: string) => {
    const i = chats.findIndex((chat: any) => chat.id === id);

    if (i !== -1) setSelectedChat(chats[i]);
  };

  const contextValue = useMemo(
    () => ({
      isPending: chatsQuery.isPending,
      refetch: chatsQuery.refetch,
      chats,
      setChats,
      selectedChat,
      setSelectedChatById,
    }),
    [chatsQuery.isPending, chats, setChats, selectedChat, setSelectedChatById]
  );

  // Refresh Chat data states, when new api data arrives
  useEffect(() => {
    if (chatsQuery.status === "success") {
      setChats(chatsQuery.data);

      if (chatsQuery.data.length > 0 && selectedChat === null) {
        setSelectedChat(chatsQuery.data[0]);
      }
    }
  }, [chatsQuery.status, chatsQuery.data]);

  // Refresh selectedChat state
  useEffect(() => {
    if (selectedChat !== null) {
      const index = chats.findIndex((chat) => {
        if (chat.id === selectedChat.id) return true;
        return false;
      });

      if (index !== -1) setSelectedChat(chats[index]);
    }
  }, [chats]);

  // Register events
  useEffect(() => {
    socket.on("message-new", () => {
      // TODO: Implement new message without refetch
      chatsQuery.refetch();
    });

    socket.on("message-seen", () => {
      // TODO: Implement new message without refetch
      chatsQuery.refetch();
    });

    socket.on("message-delete", () => {
      // TODO: Implement new message without refetch
      chatsQuery.refetch();
    });

    socket.on("message-edit", () => {
      // TODO: Implement new message without refetch
      chatsQuery.refetch();
    });

    socket.on("chat-edit", () => {
      // TODO: Implement new message without refetch
      chatsQuery.refetch();
    });

    return () => {
      socket.off("message-new");
      socket.off("message-seen");
      socket.off("message-delete");
      socket.off("message-edit");
      socket.off("chat-edit");
    };
  }, []);

  return (
    <ChatsContext.Provider value={contextValue}>
      {children}
    </ChatsContext.Provider>
  );
}
