import {IsDateString, IsOptional} from "class-validator";

export class CreateInviteDto {
  @IsOptional()
  @IsDateString()
  expireTime?: Date;
}
