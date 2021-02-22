import { ForbiddenException } from "@nestjs/common";
import * as pathUtil from "path";

export const STICKER_MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
export const STICKER_ALL_FILETYPES_ALLOWED = /jpeg|jpg|png|gif/;
export const STICKER_PICTURE_FILETYPES_ALLOWED = /jpeg|jpg|png/;
export const STICKER_GIF_FILETYPES_ALLOWED = /gif/;

export type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

const multerOptionFactory = (maxSize: number, fileTypes: RegExp) => {
  return {
    limits: {
      fileSize: maxSize,
    },
    fileFilter(
      req: any,
      file: MulterFile,
      callback: (error: Error | null, acceptFile: boolean) => void
    ) {
      const filetypes = fileTypes;

      const hasCorrectExtensionName = filetypes.test(
        pathUtil.extname(file.originalname).toLowerCase()
      );
      const hasCorrectMimetype = filetypes.test(file.mimetype);

      if (hasCorrectMimetype && hasCorrectExtensionName) {
        return callback(null, true);
      }

      callback(new ForbiddenException("Not the correct file type."), false);
    },
  };
};

export const STICKER_VALIDATION_MULTER_ALL = multerOptionFactory(
  STICKER_MAX_FILE_SIZE_BYTES,
  STICKER_ALL_FILETYPES_ALLOWED
);
export const STICKER_VALIDATION_MULTER_PICTURE = multerOptionFactory(
  STICKER_MAX_FILE_SIZE_BYTES,
  STICKER_PICTURE_FILETYPES_ALLOWED
);
export const STICKER_VALIDATION_MULTER_GIF = multerOptionFactory(
  STICKER_MAX_FILE_SIZE_BYTES,
  STICKER_GIF_FILETYPES_ALLOWED
);
