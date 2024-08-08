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

  static async doRegistration(username: string, password: string) {
    return fetch("http://Localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  }

  static async doRefresh(token: string, refreshToken: string) {
    return fetch("http://Localhost:4000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refreshToken }),
    });
  }

  static async doPing() {
    return await RequestService.get("/general/ping");
  }
}

export default ApiService;
