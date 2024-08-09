// Package Imports
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

// Custom Imports
import ApiService from "../../service/api.service";
import TokenService from "../../service/token.service";
import TextInput from "../../components/form/TextInput/TextInput";
import CheckboxInput from "../../components/form/CheckboxInput/CheckboxInput";
import MessageBox from "../../components/form/MessageBox/MessageBox";
import ButtonInput from "../../components/form/ButtonInput/ButtonInput";
import SubmitButtonInput from "../../components/form/SubmitButtonInput/SubmitButtonInput";
import Logo from "../../components/general/Logo/Logo";

// Styling
import "./Signin.scss";

function Signin() {
  // Hooks
  const navigate = useNavigate();
  const search: { registrationComplete?: boolean } = useSearch({
    from: "/signin",
  });

  // States
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  }>({
    type: "success",
    message: search.registrationComplete
      ? "Erfolgreich registriert. Melden Sie sich jetzt an!"
      : "",
  });

  // Queries
  const login = useMutation({
    mutationFn: () => {
      // throw "eeee";
      return ApiService.doAuthenticate(username, password);
    },
    onSuccess: (data) => {
      // Save tokens
      TokenService.updateLocalToken(data.token, data.tokenExpire, rememberMe);
      TokenService.updateLocalRefreshToken(
        data.refreshToken,
        data.refreshTokenExpire,
        rememberMe
      );

      // Redirect to chat page
      navigate({ to: "/chat" });
    },
    onError: (err) => {
      // Default error message
      let message = "Beim Anmelden ist ein Fehler aufgetreten.";

      // Validation error message
      if (err.name === "ValidationError") {
        message = err.message;
      }

      // Build error message for false credentials
      if (
        err.message === "api.errors.authentication.userNotFound" ||
        err.message === "api.errors.authentication.wrongPassword"
      ) {
        message = "Benutzername oder Passwort ist falsch.";
      }

      // Display MessageBox
      setMessageBoxData({
        type: "error",
        message,
      });
    },
  });

  // Form submit action
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    login.mutate();
  };

  return (
    <div className="container">
      <div className="signin-container">
        <Logo />
        <MessageBox
          type={messageBoxData.type}
          message={messageBoxData.message}
        />
        <form className="signin-form" onSubmit={submitForm}>
          <TextInput
            value={username}
            onChange={setUsername}
            label="Benutzername"
            required
          />
          <TextInput
            value={password}
            onChange={setPassword}
            label="Passwort"
            type="password"
            required
          />
          <CheckboxInput
            value={rememberMe}
            onChange={setRememberMe}
            label="Angemeldet bleiben"
          />
          <SubmitButtonInput
            type="primary"
            label="Anmelden"
            loading={login.isPending}
          />
        </form>
        <div className="action-container">
          <ButtonInput
            type="secondary"
            label="Registrieren"
            onClick={() => navigate({ to: "/signup" })}
          />
          <ButtonInput
            type="secondary"
            label="Passwort vergessen"
            onClick={() => navigate({ to: "/password/forgot" })}
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;
