// Custom imports
import { File } from "buffer";
import RequestService from "./request.service";

class ApiService {
  /**
   * Fetch a list of all cahts from the api
   * @returns
   */
  static async fetchChats() {
    return RequestService.get("/chat/all");
  }

  /**
   * Fetch a specific chat by its id from the api
   * @param chatId
   * @returns
   */
  static async fetchChat(chatId: string) {
    return RequestService.get("/chat/" + chatId);
  }

  /**
   * Fetch all messages starting from a cursor from a specific chat from the api
   * @param chatId
   * @param cursor
   * @returns
   */
  static async fetchMessages(chatId: string, cursor: string | null = null) {
    if (cursor !== null) {
      return fetch(
        "http://Localhost:4000/api/chat/" + chatId + "/messages/" + cursor
      );
    } else {
      return fetch("http://Localhost:4000/api/chat/" + chatId + "/messages");
    }
  }

  /**
   * Do authentication to request api tokens
   * @param username
   * @param password
   * @returns
   */
  static async doAuthenticate(username: string, password: string) {
    return RequestService.post("/auth/authenticate", {
      username,
      password,
    });
  }

  /**
   * Do a registration at the api
   * @param username
   * @param password
   * @param email
   * @returns
   */
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

  /**
   * Refresh access token
   * @param token
   * @param refreshToken
   * @returns
   */
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

  /**
   * Fetch a userlist from the api (only users from own chats)
   * @returns
   */
  static async fetchUserList() {
    return RequestService.get("/users/all");
  }

  /**
   * Do a connection test
   * @returns
   */
  static async doPing() {
    return await RequestService.get("/general/ping");
  }

  /**
   * Request a new password
   * @param input
   * @returns
   */
  static async doPasswordForgot(input: string) {
    return await RequestService.post("/auth/password/forgot", {
      input,
    });
  }

  /**
   * Change group avatar
   * @param input
   * @returns
   */
  static async changeGroupAvatar(chatId: string, file: any) {
    return await RequestService.postFileUpload(
      "/chat/" + chatId + "/avatar",
      file
    );
  }

  /**
   * Set a new password after forgot
   * @param code
   * @param password
   * @returns
   */
  static async doPasswordForgotChange(code: string, password: string) {
    return await RequestService.post("/auth/password/forgot/change", {
      code,
      password,
    });
  }
}

export default ApiService;
