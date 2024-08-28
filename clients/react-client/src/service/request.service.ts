// Custom imports
import TokenService from "./token.service";

class RequestService {
  /**
   * Do a GET reqest to the API
   * @param url
   * @returns
   */
  static async get(url: string) {
    const res = await fetch("http://Localhost:4000/api" + url, {
      method: "get",
      headers: this.getAuthHeader(),
    });

    // On success return data
    if (res.status === 200) {
      return await res.json();
    }

    // Try to refresh tokens
    if (res.status === 401) {
      const refresh = await TokenService.refreshTokens();

      // Redirect to login if session invalid, and remove old tokens
      if (!refresh) {
        console.log("Refresh", refresh);
        // window.location.replace("/signin");
      }

      throw await res.json();
    }

    // On all other errors
    throw await res.json();
  }

  /**
   * Do a POST request to the API
   * @param url
   * @param data
   * @returns
   */
  static async post(url: string, data: any) {
    const res = await fetch("http://Localhost:4000/api" + url, {
      method: "post",
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    // On success return data
    if (res.status === 200) {
      return await res.json();
    }

    // Try to refresh tokens
    if (res.status === 401) {
      const refresh = await TokenService.refreshTokens();

      // Redirect to login if session invalid
      if (!refresh) {
        window.location.replace("/signin");
      }

      throw await res.json();
    }

    // On all other errors
    throw await res.json();
  }

  /**
   * Builds the headers for the api requests, adds access-token
   * @returns
   */
  static getAuthHeader() {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    if (TokenService.getLocalToken()) {
      return {
        ...headers,
        "x-webconnect-token": TokenService.getLocalToken() as string,
      };
    } else {
      return headers;
    }
  }
}

export default RequestService;
