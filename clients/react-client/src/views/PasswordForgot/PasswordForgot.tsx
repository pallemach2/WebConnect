// Package imports
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
import "./PasswordForgot.scss";

function PasswordForgot() {
  // Hooks
  const navigate = useNavigate();

  // States
  const [input, setInput] = useState("");
  const [messageBoxData, setMessageBoxData] = useState<IMessageBoxData>({
    type: "success",
    message: "",
  });

  // Register action
  const passwordForgot = useMutation({
    mutationFn: () => {
      return ApiService.doPasswordForgot(input);
    },
    onSuccess: () => {
      // Redirect to chat page
      navigate({
        to: "/signin",
        search: {
          passwordForgotComplete: true,
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
    passwordForgot.mutate();
  };

  return (
    <div className="container">
      <div className="password-forgot-container">
        <Logo />
        <h2>Passwort vergessen</h2>
        <MessageBox
          type={messageBoxData.type}
          message={messageBoxData.message}
        />
        <form className="password-forgot-form" onSubmit={submitForm}>
          <TextInput
            value={input}
            onChange={setInput}
            label="Benutzername oder E-Mail"
            required
          />
          <SubmitButtonInput
            type="primary"
            label="Passwort zurücksetzen"
            loading={passwordForgot.isPending}
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

export default PasswordForgot;
