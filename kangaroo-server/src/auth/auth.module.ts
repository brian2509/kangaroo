import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { TypedConfigModule } from "nest-typed-config/index";
import { ConfigService } from "../env.validation";

@Module({
  imports: [
    TypedConfigModule,
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.JWT_SECRET,
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    TypedConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
