import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserRo } from "../users/dto/response-user.dto";
import { AuthService } from "./auth.service";
import { JwtToken } from "./dto/jwt.dto";
import { RegisterUserDto } from "./dto/register-user-dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req): JwtToken {
    return this.authService.createJwtToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("refresh")
  refresh(@Req() req): JwtToken {
    return this.authService.createJwtToken(req.user);
  }

  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserRo> {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("test")
  testAuth(@Req() req) {
    return { authenticated: true };
  }
}
