import { instance } from "./generatedApiWrapper";

import { StickerRo } from "./generated-typescript-api-client/src";

export interface UploadStickerDto {
    stickerPackId: string;
    stickerName: string;
    file: {
        name: string;
        base64: string;
    };
}

export const uploadSticker = async ({
    stickerPackId,
    stickerName,
    file
}: UploadStickerDto): Promise<StickerRo> => {
    const res = await instance.post(
        `sticker-packs/${stickerPackId}/stickers/base64`, 
        {
            name: stickerName,
            filename: file.name,
            file: file.base64,
        }
    );
    return res.data as StickerRo;
};
