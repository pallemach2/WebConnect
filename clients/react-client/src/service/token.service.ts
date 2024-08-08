import ApiService from "./api.service";

class TokenService {
  static tokenFieldName = "x-webconnect-token";
  static refreshTokenFieldName = "x-webconnect-refreshtoken";

  static tokenExpireFieldName = "x-webconnect-token-expire";
  static refreshTokenExpireFieldName = "x-webconnect-refreshtoken-expire";

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

  static getUser = () => {
    if (sessionStorage.getItem("X-WebConnect-User") !== null) {
      return JSON.parse(sessionStorage.getItem("X-WebConnect-User") as string);
    } else {
      return null;
    }
  };

  static removeUser = () => {
    sessionStorage.removeItem("X-WebConnect-User");
  };

  static updateUser = (user: {
    mail: string;
    username: string;
    id: string;
  }) => {
    sessionStorage.setItem("X-WebConnect-User", JSON.stringify(user));
  };

  static findRememberMe = () => {
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
  };

  static refreshTokens = async () => {
    const res = await ApiService.doRefresh(
      this.getLocalToken() as string,
      this.getLocalRefreshToken() as string
    );

    if (res.status === 200) {
      const data = await res.json();

      this.updateLocalToken(
        data.token,
        data.tokenExpire,
        this.findRememberMe()
      );

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
