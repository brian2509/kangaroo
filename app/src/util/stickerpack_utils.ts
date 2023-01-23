import dayjs from "dayjs";
import { StickerPackRo, StickerRo, UserPrivateRo, UserRo } from "../api/generated-typescript-api-client/src";

export const isAuthor = (stickerPack: StickerPackRo, user: UserRo | UserPrivateRo): boolean => {
    return stickerPack.author.id == user.id;
};

export const sortStickersByCreatedAt = (stickers: StickerRo[]): StickerRo[] => {
    return stickers.sort((a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)));
}

export const lastUpdatedInStickerPack = (stickerPack: StickerPackRo): string => {
    if (stickerPack.stickers.length == 0) return stickerPack.createdAt;

    // Find max of all dates, use sticker pack updatedAt and all stickers' updatedAt
    const allUpdatedAt = [stickerPack.updatedAt, ...stickerPack.stickers.map((sticker) => sticker.updatedAt)]
    const allUpdatedAtUnix = allUpdatedAt.map((date) => dayjs.utc(date).unix())
    const lastUpdatedIndex = allUpdatedAtUnix.indexOf(Math.max(...allUpdatedAtUnix));

    return allUpdatedAt[lastUpdatedIndex];
}
