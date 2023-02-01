import { ForbiddenException } from "@nestjs/common";
import * as pathUtil from "path";

export const STICKER_MAX_FILE_SIZE_BYTES = 500 * 1024;
export const STICKER_ALL_FILETYPES_ALLOWED = /jpeg|jpg|png|gif/;

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

export const removeDataPrefixBase64 = base64String => base64String.replace(/^data:.+;base64,/, '');

export const validateStickerFile = (buffer: Buffer, filename: string) => {
  const filetypes = STICKER_ALL_FILETYPES_ALLOWED;

  const hasCorrectExtensionName = filetypes.test(
    pathUtil.extname(filename).toLowerCase()
  );
  const hasCorrectMimetype = filetypes.test(filename);

  if (!hasCorrectMimetype || !hasCorrectExtensionName) {
    throw new ForbiddenException("Not the correct file type.");
  }

  if (Buffer.byteLength(buffer) > STICKER_MAX_FILE_SIZE_BYTES) {
    throw new ForbiddenException("File is too large.");
  }

  return true;
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
