import { StickerRo } from "../../stickers/dto/response-sticker.dto";

export class StickerPackRo {
  id: string;
  name: string;
  private: boolean;
  stickers: StickerRo[];
}
