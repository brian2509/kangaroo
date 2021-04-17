import * as gifResize from "@gumlet/gif-resize";
import { ForbiddenException, Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import {
  WHATSAPP_ICON_HEIGHT_PX,
  WHATSAPP_ICON_SIZE_PX,
  WHATSAPP_ICON_WIDTH_PX,
  WHATSAPP_STICKER_HEIGHT_PX,
  WHATSAPP_STICKER_SIZE_ANIMATED_KB,
  WHATSAPP_STICKER_SIZE_NON_ANIMATED_KB,
  WHATSAPP_STICKER_WIDTH_PX,
} from "./constants/whatsapp.constants";

@Injectable()
export class ImagesService {
  constructor() {}

  async createWhatsappImage(
    data: Buffer,
    animated: boolean
  ): Promise<Buffer> {
    // Image validation (file type/size done earlier).
    const metaData = await sharp(data).metadata();

    const allowedFileFormat = animated ? ["gif"] : ["jpeg", "png"];
    if (!allowedFileFormat.includes(metaData.format)) {
      throw new ForbiddenException("This format is not allowed.");
    }

    if (metaData.width !== metaData.height) {
      throw new ForbiddenException("File should be square.");
    }

    // Create image.
    let whatsAppStickerImage;
    try {
      if (animated) {
        const resizedGif = await this.gifResizeWrapper(
          data,
          WHATSAPP_STICKER_WIDTH_PX,
          WHATSAPP_STICKER_HEIGHT_PX
        );
        whatsAppStickerImage = await sharp(resizedGif, {
          animated: true,
        })
          .webp()
          .toBuffer();
      } else {
        whatsAppStickerImage = await sharp(data)
          .resize(WHATSAPP_STICKER_WIDTH_PX, WHATSAPP_STICKER_HEIGHT_PX)
          .webp()
          .toBuffer();
      }
    } catch (e) {
      throw new ForbiddenException(
        "Could not resize/convert images (sharp error)."
      );
    }

    // Check file size post image manipulation.
    const maxSizeInKb = animated
      ? WHATSAPP_STICKER_SIZE_ANIMATED_KB
      : WHATSAPP_STICKER_SIZE_NON_ANIMATED_KB;
    if (whatsAppStickerImage.byteLength / 1024 > maxSizeInKb) {
      throw new ForbiddenException(
        "The (sticker) file is too large after conversion."
      );
    }

    return whatsAppStickerImage;
  }

  async gifResizeWrapper(
    data: Buffer,
    width: number,
    height: number
  ): Promise<Buffer> {
    /**
     * TODO: This function is very slow; either do everything on the client or wait for sharp update.
     * https://github.com/lovell/sharp/issues/2275
     */
    return new Promise<Buffer>((resolve, reject) => {
      gifResize({
        width,
        height,
        stretch: true,
      })(data)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    });
  }
}
