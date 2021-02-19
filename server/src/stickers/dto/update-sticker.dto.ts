import { PartialType } from "@nestjs/mapped-types";
import { CreateStickerDto } from "./create-sticker.dto";

export class UpdateStickerDto extends PartialType(CreateStickerDto) {}
