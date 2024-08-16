import RequestService from "./request.service";

class ApiService {
  static async fetchChats() {
    return RequestService.get("/chat/all");
  }

  static async fetchChat(chatId: string) {
    return RequestService.get("/chat/" + chatId);
  }

  static async fetchMessages(chatId: string, cursor: string | null = null) {
    if (cursor !== null) {
      return fetch(
        "http://Localhost:4000/api/chat/" + chatId + "/messages/" + cursor
      );
    } else {
      return fetch("http://Localhost:4000/api/chat/" + chatId + "/messages");
    }
  }

  static async doAuthenticate(username: string, password: string) {
    return RequestService.post("/auth/authenticate", {
      username,
      password,
    });
  }

  static async doRegistration(
    username: string,
    password: string,
    email: string
  ) {
    return RequestService.post("/auth/register", {
      username,
      password,
      email,
    });
  }

  static async doRefresh(token: string, refreshToken: string) {
    return fetch("http://Localhost:4000/api/auth/refresh", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token,
        refreshToken,
      }),
    });
  }

  static async fetchUserList() {
    return RequestService.get("/users/all");
  }

  static async doPing() {
    return await RequestService.get("/general/ping");
  }

  static async doPasswordForgot(input: string) {
    return await RequestService.post("/auth/password/forgot", {
      input,
    });
  }

  static async doPasswordForgotChange(code: string, password: string) {
    return await RequestService.post("/auth/password/forgot/change", {
      code,
      password,
    });
  }
}

export default ApiService;
