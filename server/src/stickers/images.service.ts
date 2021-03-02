import { ForbiddenException, Injectable } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class ImagesService {
  constructor() {}

  async createWhatsappImages(
    data: Buffer,
    animated: boolean = false
  ): Promise<{ whatsAppStickerImage: Buffer; whatsAppIconImage: Buffer }> {
    // Image validation (file type/size done earlier).
    const metaData = await sharp(data).metadata();

    const allowedFileFormat = animated ? ["gif"] : ["jpeg", "png"];
    if (!allowedFileFormat.includes(metaData.format)) {
      throw new ForbiddenException("This format is not allowed.");
    }

    // if (metaData.width !== metaData.height) {
    //   throw new ForbiddenException("File should be square.");
    // }

    // Create images.
    let whatsAppStickerImage;
    let whatsAppIconImage;
    try {
      if (animated) {
        // TODO: Resize this animated file somehow.
        whatsAppStickerImage = await sharp(data, {
          animated: true,
        })
          .webp()
          .toBuffer();
      } else {
        whatsAppStickerImage = await sharp(data)
          .resize(512, 512)
          .webp()
          .toBuffer();
      }
      whatsAppIconImage = await sharp(data).resize(96, 96).webp().toBuffer();
    } catch (e) {
      throw new ForbiddenException(
        "Could not resize/convert images (sharp error)."
      );
    }

    // Check file size post image manipulation.
    const maxSizeInKb = animated ? 500 : 100;
    if (whatsAppStickerImage.byteLength / 1024 > maxSizeInKb) {
      throw new ForbiddenException(
        "The (sticker) file is too large after conversion."
      );
    }

    if (whatsAppIconImage.byteLength / 1024 > 50) {
      throw new ForbiddenException(
        "The (sticker thumbnail) file is too large after conversion."
      );
    }

    return { whatsAppStickerImage, whatsAppIconImage };
  }
}
