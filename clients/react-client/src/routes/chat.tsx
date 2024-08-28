// Package imports
import { createFileRoute, redirect } from "@tanstack/react-router";

// Custom Imports
import TokenService from "../service/token.service";
import Chat from "../views/Chat/Chat";
import { ChatProvider } from "../context/ChatsContext";
import { UserOnlineProvider } from "../context/UserOnlineContext";

export const Route = createFileRoute("/chat")({
  pendingMinMs: 5000,
  pendingMs: 1000,
  component: () => (
    <ChatProvider>
      <UserOnlineProvider>
        <Chat />
      </UserOnlineProvider>
    </ChatProvider>
  ),
  beforeLoad: () => {
    if (!TokenService.getLocalToken()) {
      throw redirect({ to: "/signin" });
    }
  },
});
