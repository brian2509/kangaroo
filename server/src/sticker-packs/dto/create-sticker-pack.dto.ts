import { IsNotEmpty, Length } from "class-validator";

export class CreateStickerPackDto {
  @IsNotEmpty()
  @Length(0, 50)
  name: string;

  @IsNotEmpty()
  private: boolean;

  @IsNotEmpty()
  animated: boolean;
}
