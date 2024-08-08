import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ApiService from "../../service/api.service";
import TokenService from "../../service/token.service";
import "./Signin.scss";
import Checkbox from "../../components/Checkbox/Checkbox";

function Signin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: () => {
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
      // Display Error
      console.log(err);
      setError("Benutzername oder Passwort ist falsch.");
    },
  });

  return (
    <div className="container">
      <div className="login-container">
        <h1>
          Web<span>Connect</span>
        </h1>
        {error && (
          <div className="error-container">
            <p className="title">Fehler</p>
            <div className="message">
              <p>{error}</p>
            </div>
          </div>
        )}
        <div className={"input-container"}>
          <label htmlFor="username">Benutzername</label>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={"input-container"}>
          <label htmlFor="password">Passwort</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div
          className="checkbox-container"
          onClick={() => setRememberMe(!rememberMe)}
        >
          <label htmlFor="rememberMe">Angemeldet bleiben</label>
          <Checkbox
            checked={rememberMe}
            onToggle={() => setRememberMe(!rememberMe)}
          />
        </div>
        <div className="action-container">
          <input
            type="button"
            onClick={() => login.mutate()}
            value={"Anmelden"}
          />
          <input
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            value={"Registrieren"}
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;
