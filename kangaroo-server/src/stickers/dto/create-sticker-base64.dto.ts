import { IsNotEmpty, Length } from "class-validator";

export class CreateStickerBase64Dto {
  @IsNotEmpty()
  @Length(0, 50)
  name: string;

  @IsNotEmpty()
  file: string;

  @IsNotEmpty()
  filename: string;
}
