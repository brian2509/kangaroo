import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../dto/jwt.dto";

class UserRO {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO: secret
      secretOrKey: "JWT_SECRET",
    });
  }

  validate(payload: JwtPayload): UserRO {
    /**
     * The payload here is already verified with the secret key
     * and decoded from JSON for us to use.
     */
    return { username: payload.username, id: payload.sub };
  }
}
