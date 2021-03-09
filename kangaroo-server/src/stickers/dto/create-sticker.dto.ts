import { IsNotEmpty, Length } from "class-validator";

export class CreateStickerDto {
  @IsNotEmpty()
  @Length(0, 50)
  name: string;
}
