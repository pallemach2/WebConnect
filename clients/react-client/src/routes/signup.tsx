// Package imports
import { createFileRoute, redirect } from "@tanstack/react-router";

// Custom imports
import TokenService from "../service/token.service";
import Signup from "../views/Signup/Signup";

export const Route = createFileRoute("/signup")({
  component: Signup,
  beforeLoad: () => {
    if (TokenService.getLocalToken()) {
      throw redirect({ to: "/chat" });
    }
  },
});
