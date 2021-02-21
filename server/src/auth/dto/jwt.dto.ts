export class JwtPayload {
  sub: string;
  username: string;
}

export class JwtToken {
  access_token: string;
}

export class AuthenticatedCheckDto {
  authenticated: boolean;
}

