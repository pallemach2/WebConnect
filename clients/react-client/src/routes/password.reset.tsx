// Package imports
import { createFileRoute, redirect } from "@tanstack/react-router";

// Custom imports
import TokenService from "../service/token.service";
import PasswordReset from "../views/PasswordReset/PasswordReset";

export const Route = createFileRoute("/password/reset")({
  component: PasswordReset,
  beforeLoad: () => {
    if (TokenService.getLocalToken()) {
      throw redirect({ to: "/chat" });
    }
  },
});
