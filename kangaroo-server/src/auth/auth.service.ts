import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRo } from "../users/dto/response-user.dto";
import { UsersService } from "../users/user.service";
import { JwtPayload, JwtToken } from "./dto/jwt.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  createJwtToken(user: UserRo): JwtToken {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(
    username: string,
    password: string
  ): Promise<UserRo | null> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    if (await user.comparePassword(password)) {
      return {
        username: user.username,
        id: user.id,
      };
    }

    return null;
  }

  async register(registerUserDto: RegisterUserDto) {
    if (await this.usersService.findByUsername(registerUserDto.username)) {
      throw new ForbiddenException("User with that username already exists.");
    }

    if (await this.usersService.findByEmail(registerUserDto.email)) {
      throw new ForbiddenException("User with that email already exists.");
    }

    const user = await this.usersService.create(
      registerUserDto.username,
      registerUserDto.email,
      registerUserDto.password
    );

    return {
      id: user.id,
      username: user.username,
    };
  }
}
