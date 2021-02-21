import { PartialType } from "@nestjs/mapped-types";
import { CreateStickerPackDto } from "./create-sticker-pack.dto";

export class UpdateStickerPackDto extends PartialType(CreateStickerPackDto) {}
