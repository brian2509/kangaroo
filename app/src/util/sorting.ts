import { StickerPackRo } from "../api/generated-typescript-api-client/src";

export const sortedStickerPacks = (stickerPacks: StickerPackRo[]): StickerPackRo[] => {
    return stickerPacks.sort((p1, p2) => (p1.updatedAt < p2.updatedAt ? 1 : -1));
};
