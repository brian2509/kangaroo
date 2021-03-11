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
    const { data } = await api.users.getOwnStickerPacks();
    return data;
};

export const useStickerPacks = () =>
    useQuery<StickerPackRo[], any, StickerPackRo[]>(QUERY_KEYS.myStickerPacks, getStickerPacks);
