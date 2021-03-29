import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { StickerPackRo } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const getStickerPackById = async (id: string) => {
    const { data } = await api.stickerPacks.findOne(id);
    return data;
};

export const useStickerPack = (id: string) =>
    useQuery<StickerPackRo, any, StickerPackRo>([QUERY_KEYS.stickerPack, id], () =>
        getStickerPackById(id),
    );

const getStickerPacks = async () => {
    const { data } = await api.users.getOwnAndJoinedStickerPacks();
    return data;
};

export const useOwnAndJoinedStickerPacks = () =>
    useQuery<StickerPackRo[], any, StickerPackRo[]>(
        QUERY_KEYS.ownAndJoinedStickerPacks,
        getStickerPacks,
    );
