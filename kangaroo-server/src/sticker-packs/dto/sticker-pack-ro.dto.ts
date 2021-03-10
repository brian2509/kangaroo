import { StickerRo } from "../../stickers/dto/response-sticker.dto";
import { UserRo } from "../../users/dto/response-user.dto";

export class StickerPackRo {
  id: string;
  name: string;
  personal: boolean;
  animated: boolean;
  stickers: StickerRo[];
  members: UserRo[];
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
