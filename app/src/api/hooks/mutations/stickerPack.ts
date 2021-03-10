import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../../util/logging";
import { uploadSticker } from "../../customApiWrappers";
import { CreateStickerPackDto } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const createStickerPack = async (createStickerPackDto: CreateStickerPackDto) => {
    const { data } = await api.stickerPacks.create(createStickerPackDto);
    return data;
};

export const useCreateStickerPackMutation = (queryClient: QueryClient) =>
    useMutation(createStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

const removeStickerPack = async (stickerPackId: string) => {
    const { data } = await api.stickerPacks.remove(stickerPackId);
    return data;
};

export const useRemoveStickerPackMutation = (queryClient: QueryClient) =>
    useMutation(removeStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

export const useUploadStickerMutation = (queryClient: QueryClient) =>
    useMutation(uploadSticker, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, variables.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
        onError: logErrorResponse,
    });
