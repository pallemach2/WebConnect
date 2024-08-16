import { io, Socket } from "socket.io-client";
import TokenService from "./token.service";

const socket: Socket = io("http://localhost:4000", {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 60000,
  reconnectionAttempts: 20,
  auth: (cb) => {
    cb({
      token: TokenService.getLocalToken(),
    });
  },
});

let focus = false;
let retries = 0;

// try to reconnect if token was invalid
socket.on("connect_error", async () => {
  if (retries < 2) {
    retries += 1;
    const res = await TokenService.refreshTokens();

    if (res) {
      socket.connect();
    } else {
      console.log("Couldnt connect.");
    }
  }
});

// Connected event
socket.on("connect", async () => {
  console.log("connected");

  // Check for initial focus
  focus = document.hasFocus();

  // Set focus when event triggers
  window.addEventListener("focus", async () => {
    focus = true;
  });

  // Set focus when event triggers
  window.addEventListener("blur", async () => {
    focus = false;
  });

  // Check if user is actively onlinetea
  while (socket.connected) {
    if (focus) socket.emit("user-online");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});

// Register auth challenge
socket.on("auth-challenge", (cb) => {
  console.log("challenge");
  cb(TokenService.getLocalToken());
});

// Logout event
socket.on("disconnect", () => {
  console.log("disconnect");
  // TokenService.deleteTokens();
  // window.location.replace("/signin");
});

export default socket;
