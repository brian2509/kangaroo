import dayjs from "dayjs";
import { StickerPackRo, StickerRo, UserPrivateRo, UserRo } from "../api/generated-typescript-api-client/src";

export const isAuthor = (stickerPack: StickerPackRo, user: UserRo | UserPrivateRo): boolean => {
    return stickerPack.author.id == user.id;
};

export const fullMemberList = (stickerPack: StickerPackRo): UserRo[] => {
    return [stickerPack.author, ...stickerPack.members];
};

export const sortStickersByCreatedAt = (stickers: StickerRo[]): StickerRo[] => {
    return stickers.sort((a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)));
}
