import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../util/logging";
import { api } from "../generatedApiWrapper";

const getStickerPacks = async () => {
    const { data } = await api.users.getOwnStickerPacks();
    return data;
};

export const useStickerPacks = () =>
    useQuery(QUERY_KEYS.myStickerPacks, getStickerPacks, {
        onError: logErrorResponse,
    });
