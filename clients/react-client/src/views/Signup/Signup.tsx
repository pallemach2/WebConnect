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
import "./Signup.scss";

function Signup() {
  // Hooks
  const navigate = useNavigate();

  // States
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [email, setEmail] = useState("");
  const [messageBoxData, setMessageBoxData] = useState<IMessageBoxData>({
    type: "success",
    message: "",
  });

  // Register action
  const register = useMutation({
    mutationFn: () => {
      if (password !== passwordRepeat)
        throw new Error("client.errors.authentication.passwordDoNMotMatch");
      return ApiService.doRegistration(username, password, email);
    },
    onSuccess: () => {
      // Redirect to chat page
      navigate({
        to: "/signin",
        search: {
          registrationComplete: true,
        },
      });
    },
    onError: (err) => {
      // Display MessageBox
      setMessageBoxData({
        type: "error",
        message:
          Messages.getMessage(err.message) ||
          Messages.getMessage("client.errors.registration"),
      });
    },
  });

  // Form submit action
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    register.mutate();
  };

  return (
    <div className="container">
      <div className="signup-container">
        <Logo />
        <h2>Registrierung</h2>
        <MessageBox
          type={messageBoxData.type}
          message={messageBoxData.message}
        />
        <form className="signup-form" onSubmit={submitForm}>
          <TextInput
            value={username}
            onChange={setUsername}
            label="Benutzername"
            required
          />
          <TextInput
            value={email}
            onChange={setEmail}
            label="E-Mail"
            required
          />
          <TextInput
            value={password}
            onChange={setPassword}
            label="Passwort"
            subLabel="Mind. 8 Zeichen, Buchstaben, Ziffer und Sonderzeichen"
            type="password"
            required
          />
          <TextInput
            value={passwordRepeat}
            onChange={setPasswordRepeat}
            label="Passwort wiederholen"
            type="password"
            required
          />
          <SubmitButtonInput
            type="primary"
            label="Registrieren"
            loading={register.isPending}
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

export default Signup;
