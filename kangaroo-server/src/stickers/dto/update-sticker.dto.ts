import { PartialType } from "@nestjs/swagger";
import { CreateStickerDto } from "./create-sticker.dto";

export class UpdateStickerDto extends PartialType(CreateStickerDto) {}
