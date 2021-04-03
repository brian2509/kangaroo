import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { uploadSticker, UploadStickerRo } from "../../customApiWrappers";
import {
    CreateStickerPackDto,
    StickerPackRo,
    StickerRo,
} from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const createStickerPack = async (createStickerPackDto: CreateStickerPackDto) => {
    const { data } = await api.stickerPacks.create(createStickerPackDto);
    return data;
};

export const useCreateStickerPackMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, CreateStickerPackDto, unknown>(createStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks),
    });

const removeStickerPack = async (stickerPackId: string) => {
    const { data } = await api.stickerPacks.remove(stickerPackId);
    return data;
};

export const useRemoveStickerPackMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, string, unknown>(removeStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks),
    });

export const useUploadStickerMutation = (queryClient: QueryClient) =>
    useMutation<StickerRo, any, UploadStickerRo, unknown>(uploadSticker, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, variables.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks);
        },
    });
