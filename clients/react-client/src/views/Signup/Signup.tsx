import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import ApiService from "../../service/api.service";
import "./Signup.scss";
import MessageBox, {
  IMessageBoxData,
} from "../../components/form/MessageBox/MessageBox";
import TextInput from "../../components/form/TextInput/TextInput";
import ButtonInput from "../../components/form/ButtonInput/ButtonInput";
import Logo from "../../components/general/Logo/Logo";
import SubmitButtonInput from "../../components/form/SubmitButtonInput/SubmitButtonInput";

function Signup() {
  const navigate = useNavigate();

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
      if (password !== passwordRepeat) throw new Error("passwordsDontMatch");
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
      // Default error message
      let message = "Beim Registrieren ist ein Fehler aufgetreten.";

      // Validation error message
      if (err.name === "ValidationError") {
        message = err.message;
      }

      // Build error message for duplicate registers
      if (err.message === "api.errors.registration.userAlreadyExists") {
        message = "Benutzername oder Email existiert bereits.";
      }

      // Build error message for false credentials
      if (err.message === "api.errors.registration.passwordNotValid") {
        message = "Ihr Passwort erfüllt nicht alle Kriterien.";
      }

      // Build error message for false credentials
      if (err.message === "passwordsDontMatch") {
        message = "Passwörter stimmen nicht überein.";
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
    register.mutate();
  };

  return (
    <div className="container">
      <div className="signup-container">
        <Logo />
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
