import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { TypedConfigModule } from "nest-typed-config/index";
import { Config } from "../env.validation";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: Config) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: "1d" },
      }),
    }),
    PassportModule,
    TypedConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
