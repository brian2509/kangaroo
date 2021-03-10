import { PartialType } from "@nestjs/swagger";
import { CreateStickerPackDto } from "./create-sticker-pack.dto";

export class UpdateStickerPackDto extends PartialType(CreateStickerPackDto) {}
