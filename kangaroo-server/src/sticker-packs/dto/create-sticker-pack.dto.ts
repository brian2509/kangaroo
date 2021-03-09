import { IsNotEmpty, Length } from "class-validator";

export class CreateStickerPackDto {
  @IsNotEmpty()
  @Length(0, 50)
  name: string;

  @IsNotEmpty()
  personal: boolean;

  @IsNotEmpty()
  animated: boolean;
}
