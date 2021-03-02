import { StickerRo } from "./generated-typescript-api-client/src";
import { instance } from "./generatedApiWrapper";

export interface UploadStickerRo {
    stickerPackId: string;
    formData: FormData; // TODO: Change this to an object {name, file}
}

export const uploadSticker = async (options: UploadStickerRo): Promise<StickerRo> => {
    // TODO: Create FormData object here
    const res = await instance.post(
        `sticker-packs/${options.stickerPackId}/stickers`,
        options.formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return res.data as StickerRo;
}
