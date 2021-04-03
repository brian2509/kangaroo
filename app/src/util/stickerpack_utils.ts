import { StickerPackRo, UserPrivateRo, UserRo } from "../api/generated-typescript-api-client/src";

export const isAuthor = (stickerPack: StickerPackRo, user: UserRo | UserPrivateRo): boolean => {
    return stickerPack.author.id == user.id;
};

export const fullMemberList = (stickerPack: StickerPackRo): UserRo[] => {
    return [stickerPack.author, ...stickerPack.members];
};
