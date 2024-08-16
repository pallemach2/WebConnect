// Package imports
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

// Custom imports
import ApiService from "../../service/api.service";
import TextInput from "../../components/form/TextInput/TextInput";
import ButtonInput from "../../components/form/ButtonInput/ButtonInput";
import Logo from "../../components/general/Logo/Logo";
import SubmitButtonInput from "../../components/form/SubmitButtonInput/SubmitButtonInput";
import MessageBox, {
  IMessageBoxData,
} from "../../components/form/MessageBox/MessageBox";
import Messages from "../../assets/messages";

// Styling
import "./PasswordReset.scss";

function PasswordReset() {
  // Hooks
  const navigate = useNavigate();
  const search: {
    code: string;
  } = useSearch({
    from: "/password/reset",
  });

  // States
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [messageBoxData, setMessageBoxData] = useState<IMessageBoxData>({
    type: "success",
    message: "",
  });

  // Register action
  const passwordReset = useMutation({
    mutationFn: () => {
      if (password !== passwordRepeat)
        throw new Error("client.errors.authentication.passwordDoNMotMatch");

      return ApiService.doPasswordForgotChange(search.code, password);
    },
    onSuccess: () => {
      // Redirect to chat page
      navigate({
        to: "/signin",
        search: {
          passwordResetComplete: true,
        },
      });
    },
    onError: (err) => {
      // Display MessageBox
      setMessageBoxData({
        type: "error",
        message:
          Messages.getMessage(err.message) ||
          Messages.getMessage("client.errors.password.reset"),
      });
    },
  });

  // Form submit action
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    passwordReset.mutate();
  };

  // If no code is set, redirect
  if (!search.code) navigate({ to: "/signin" });

  return (
    <div className="container">
      <div className="password-reset-container">
        <Logo />
        <h2>Passwort ändern</h2>
        <MessageBox
          type={messageBoxData.type}
          message={messageBoxData.message}
        />
        <form className="password-reset-form" onSubmit={submitForm}>
          <TextInput
            value={password}
            type="password"
            onChange={setPassword}
            label="Passwort"
            subLabel="Mind. 8 Zeichen, Buchstaben, Ziffer und Sonderzeichen"
            required
          />
          <TextInput
            value={passwordRepeat}
            type="password"
            onChange={setPasswordRepeat}
            label="Passwort wiederholen"
            required
          />
          <SubmitButtonInput
            type="primary"
            label="Passwort ändern"
            loading={passwordReset.isPending}
          />
        </form>
        <ButtonInput
          type="secondary"
          label="Zurück zur Anmeldung"
          onClick={() => navigate({ to: "/signin" })}
        />
      </div>
    </div>
  );
}

export default PasswordReset;
