import { UserRo } from "../../users/dto/response-user.dto";

export class StickerRo {
  id: string;
  name: string;
  fileUrl: string;
  whatsAppStickerImageFileUrl: string;
  whatsAppIconImageFileUrl: string;
  uploadedBy: UserRo;
  createdAt: Date;
  updatedAt: Date;
}
