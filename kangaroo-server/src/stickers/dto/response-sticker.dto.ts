import { UserRo } from "../../users/dto/response-user.dto";

export class StickerRo {
  id: string;
  name: string;
  author: UserRo;
  fileUrl: string;
  whatsAppStickerImageFileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
