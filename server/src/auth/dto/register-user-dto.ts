import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { User } from "../../users/entities/user.entity";

export class RegisterUserDto implements Partial<User> {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @Length(4, 20)
  @IsString()
  username: string;

  @IsNotEmpty()
  @Length(8, 50)
  @IsString()
  password: string;
}
