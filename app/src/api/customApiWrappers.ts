import { StickerRo } from "./generated-typescript-api-client/src";
import { instance } from "./generatedApiWrapper";

export interface UploadStickerRo {
    stickerPackId: string;
    stickerName: string;
    file: {
        uri: string;
        name: string;
        type: string;
    };
}

export const uploadSticker = async (options: UploadStickerRo): Promise<StickerRo> => {
    const formData = new FormData();
    formData.append("name", options.stickerName);
    formData.append("file", options.file);

    const res = await instance.post(`sticker-packs/${options.stickerPackId}/stickers`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data as StickerRo;
};
