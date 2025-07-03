export interface IAuthTokenResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
