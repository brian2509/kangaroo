import { StickerRo } from "../../stickers/dto/response-sticker.dto";
import { UserRo } from "../../users/dto/response-user.dto";

export class StickerPackRo {
  id: string;
  name: string;
  personal: boolean;
  animated: boolean;
  stickers: StickerRo[];
  trayIconImageFileUrl: string | undefined;
  trayIconImageFileUrlOriginal: string | undefined;
  members: UserRo[];
  author: UserRo;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
