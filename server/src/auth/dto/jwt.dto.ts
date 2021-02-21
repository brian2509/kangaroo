export type JwtPayload = {
  sub: string;
  username: string;
};

export type JwtToken = {
  access_token: string;
};
