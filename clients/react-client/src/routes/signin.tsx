// Package imports
import { createFileRoute, redirect } from "@tanstack/react-router";

// Custom imports
import TokenService from "../service/token.service";
import Signin from "../views/Signin/Signin";

export const Route = createFileRoute("/signin")({
  component: Signin,
  beforeLoad: () => {
    if (TokenService.getLocalToken()) {
      throw redirect({ to: "/chat" });
    }
  },
});
