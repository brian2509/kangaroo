import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRo } from "../users/dto/response-user.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedCheckDto, JwtToken } from "./dto/jwt.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "Log into a registered account and receive a JWT token.",
  })
  @Post("login")
  login(@Req() req, @Body() loginUserDto: LoginUserDto): JwtToken {
    return this.authService.createJwtToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Receive a new JWT token upon providing a valid JWT token.",
  })
  @Get("refresh")
  refresh(@Req() req): JwtToken {
    return this.authService.createJwtToken(req.user);
  }

  @ApiOperation({
    summary: "Register a new account.",
  })
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserRo> {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Simple authentication check upon providing a valid JWT token (may be removed later).",
  })
  @Get("authenticated")
  testAuth(@Req() req): AuthenticatedCheckDto {
    return { authenticated: true };
  }
}
