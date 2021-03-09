import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../../util/logging";
import { CreateStickerPackDto } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const createStickerPack = async (createStickerPackDto: CreateStickerPackDto) => {
    const { data } = await api.stickerPacks.create(createStickerPackDto);
    return data;
};

export const useCreateStickerPackMutation = (queryClient: QueryClient) =>
    useMutation(
        (createStickerPackDto: CreateStickerPackDto) => createStickerPack(createStickerPackDto),
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
            onError: logErrorResponse,
        },
    );
