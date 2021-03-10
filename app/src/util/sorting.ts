import { StickerPackRo, StickerRo } from "../api/generated-typescript-api-client/src";

export const sortedStickerPacks = (stickerPacks: StickerPackRo[]): StickerPackRo[] => {
    return stickerPacks.sort((p1, p2) => (p1.updatedAt < p2.updatedAt ? 1 : -1));
};

export const sortedStickers = (stickers: StickerRo[]): StickerRo[] => {
    return stickers.sort((p1, p2) => (p1.updatedAt < p2.updatedAt ? 1 : -1));
};
