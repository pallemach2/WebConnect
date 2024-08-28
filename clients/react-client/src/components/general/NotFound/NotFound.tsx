// Package imports
import { Navigate } from "@tanstack/react-router";

// Custom imports
import TokenService from "../../../service/token.service";

export default function NotFound() {
  if (TokenService.getLocalToken()) {
    return <Navigate to="/chat" />;
  } else {
    return <Navigate to="/signin" />;
  }
}
