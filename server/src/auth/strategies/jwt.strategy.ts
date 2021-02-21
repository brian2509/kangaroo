import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRo } from "../../users/dto/response-user.dto";
import { JwtPayload } from "../dto/jwt.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
    });
  }

  validate(payload: JwtPayload): UserRo {
    /**
     * The payload here is already verified with the secret key
     * and decoded from JSON for us to use.
     */
    return { username: payload.username, id: payload.sub };
  }
}
