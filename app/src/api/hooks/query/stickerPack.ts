import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../../util/logging";
import { api } from "../../generatedApiWrapper";

const getStickerPackById = async (id: string) => {
    const { data } = await api.stickerPacks.findOne(id);
    return data;
};

export const useStickerPack = (id: string) =>
    useQuery([QUERY_KEYS.stickerPack, id], () => getStickerPackById(id), {
        onError: logErrorResponse,
    });

const getStickerPacks = async () => {
    const { data } = await api.users.getOwnStickerPacks();
    return data;
};

export const useStickerPacks = () =>
    useQuery(QUERY_KEYS.myStickerPacks, getStickerPacks, {
        onError: logErrorResponse,
    });

const getStickerPackLike = async (id: string) => {
    const { data } = await api.stickerPacks.likeStickerPack(id);
    return data;
};

export const useStickerPackLike = (id: string) =>
    useQuery([QUERY_KEYS.like, id], () => getStickerPackLike(id), {
        onError: logErrorResponse,
        enabled: false, // not automatically called, refetch needed
    });
