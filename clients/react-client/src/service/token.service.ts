import ApiService from "./api.service";
import socket from "./socket.service";

class TokenService {
  static tokenFieldName = "x-webconnect-token";
  static refreshTokenFieldName = "x-webconnect-refreshtoken";

  static tokenExpireFieldName = "x-webconnect-token-expire";
  static refreshTokenExpireFieldName = "x-webconnect-refreshtoken-expire";

  static userFieldName = "X-WebConnect-User";

  static getLocalToken = () => {
    return (
      localStorage.getItem(this.tokenFieldName) ||
      sessionStorage.getItem(this.tokenFieldName)
    );
  };

  static getLocalRefreshToken = () => {
    return (
      localStorage.getItem(this.refreshTokenFieldName) ||
      sessionStorage.getItem(this.refreshTokenFieldName)
    );
  };

  static getLocalRefreshTokenExpire = () => {
    return (
      localStorage.getItem(this.refreshTokenExpireFieldName) ||
      sessionStorage.getItem(this.refreshTokenExpireFieldName)
    );
  };

  static getLocalTokenExpire = () => {
    return (
      localStorage.getItem(this.tokenExpireFieldName) ||
      sessionStorage.getItem(this.tokenExpireFieldName)
    );
  };

  static getUser = (): {
    avatar: string;
    username: string;
    id: string;
  } => {
    if (sessionStorage.getItem(this.userFieldName) !== null) {
      return JSON.parse(sessionStorage.getItem(this.userFieldName) as string);
    } else {
      this.deleteTokens();
      window.location.reload();

      // Send empty mock data
      return { avatar: "", username: "", id: "" };
    }
  };

  static removeUser = () => {
    sessionStorage.removeItem(this.userFieldName);
  };

  static updateUser = (user: {
    avatar: string;
    username: string;
    id: string;
  }) => {
    sessionStorage.setItem(this.userFieldName, JSON.stringify(user));
  };

  static findRememberMe = (): boolean => {
    if (localStorage.getItem(this.tokenFieldName) !== null) {
      return true;
    } else {
      return false;
    }
  };

  static updateLocalToken = (
    token: string,
    expire: string,
    rememberMe: boolean = true
  ) => {
    if (rememberMe) {
      sessionStorage.removeItem(this.tokenFieldName);
      localStorage.setItem(this.tokenFieldName, token);

      sessionStorage.removeItem(this.tokenExpireFieldName);
      localStorage.setItem(this.tokenExpireFieldName, expire);
    } else {
      localStorage.removeItem(this.tokenFieldName);
      sessionStorage.setItem(this.tokenFieldName, token);

      localStorage.removeItem(this.tokenExpireFieldName);
      sessionStorage.setItem(this.tokenExpireFieldName, expire);
    }
  };

  static updateLocalRefreshToken = (
    token: string,
    expire: string,
    rememberMe: boolean = true
  ) => {
    if (rememberMe) {
      sessionStorage.removeItem(this.refreshTokenFieldName);
      localStorage.setItem(this.refreshTokenFieldName, token);

      sessionStorage.removeItem(this.refreshTokenExpireFieldName);
      localStorage.setItem(this.refreshTokenExpireFieldName, expire);
    } else {
      localStorage.removeItem(this.refreshTokenFieldName);
      sessionStorage.setItem(this.refreshTokenFieldName, token);

      localStorage.removeItem(this.refreshTokenExpireFieldName);
      sessionStorage.setItem(this.refreshTokenExpireFieldName, expire);
    }
  };

  static deleteTokens = () => {
    localStorage.removeItem(this.tokenFieldName);
    localStorage.removeItem(this.refreshTokenFieldName);
    sessionStorage.removeItem(this.tokenFieldName);
    sessionStorage.removeItem(this.refreshTokenFieldName);

    localStorage.removeItem(this.tokenExpireFieldName);
    localStorage.removeItem(this.refreshTokenExpireFieldName);
    sessionStorage.removeItem(this.tokenExpireFieldName);
    sessionStorage.removeItem(this.refreshTokenExpireFieldName);

    localStorage.removeItem(this.userFieldName);
    sessionStorage.removeItem(this.userFieldName);
  };

  static refreshTokens = async () => {
    const res = await ApiService.doRefresh(
      this.getLocalToken() as string,
      this.getLocalRefreshToken() as string
    );

    if (res.status === 200) {
      const data = await res.json();

      this.updateUser({
        id: data.userId,
        username: data.username,
        avatar: data.avatar,
      });

      this.updateLocalToken(
        data.token,
        data.tokenExpire,
        this.findRememberMe()
      );

      // Refresh session in socket
      socket.auth = (cb) => {
        cb(data.token);
      };

      this.updateLocalRefreshToken(
        data.refreshToken,
        data.refreshTokenExpire,
        this.findRememberMe()
      );

      return true;
    } else {
      this.deleteTokens();
      return false;
    }
  };
}

export default TokenService;
