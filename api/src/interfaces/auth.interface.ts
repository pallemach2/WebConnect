export interface TokenObject {
  token: string;
  expiresAt: number;
}

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface Auth {
  access_token: TokenObject;
  refresh_token: TokenObject;
  profile?: {
    id: string;
  };
}

export default Auth;
