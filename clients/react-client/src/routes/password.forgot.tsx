// Package imports
import { createFileRoute, redirect } from "@tanstack/react-router";

// Custom imports
import TokenService from "../service/token.service";
import PasswordForgot from "../views/PasswordForgot/PasswordForgot";

export const Route = createFileRoute("/password/forgot")({
  component: PasswordForgot,
  beforeLoad: () => {
    if (TokenService.getLocalToken()) {
      throw redirect({ to: "/chat" });
    }
  },
});
