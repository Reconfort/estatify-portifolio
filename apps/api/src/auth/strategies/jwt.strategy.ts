import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { AccessTokenPayload } from "@estatify/types";
import { env } from "../../config/env";

/** Validates the Bearer access token; the return value becomes req.user. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: AccessTokenPayload): AccessTokenPayload {
    if (payload.typ !== "access") {
      throw new UnauthorizedException("Invalid token type");
    }
    return payload;
  }
}
