import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { uploadSticker, UploadStickerDto } from "../../customApiWrappers";
import {
    CreateStickerPackDto,
    StickerPackRo,
    StickerRo,
} from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

// Create Sticker Pack Mutation
const createStickerPack = async (createStickerPackDto: CreateStickerPackDto) => {
    const { data } = await api.stickerPacks.create(createStickerPackDto);
    return data;
};
export const useCreateStickerPackMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, CreateStickerPackDto, unknown>(createStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
    });

// Remove Sticker Pack Mutation
const removeStickerPack = async (stickerPackId: string) => {
    const { data } = await api.stickerPacks.remove(stickerPackId);
    return data;
};
export const useRemoveStickerPackMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, string, unknown>(removeStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
    });

// Upload Sticker Mutation
export const useUploadStickerMutation = (queryClient: QueryClient) =>
    useMutation<StickerRo, any, UploadStickerDto, unknown>(uploadSticker, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, variables.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
    });

// Delete Sticker Mutation
interface DeleteStickerRo {
    stickerPackId: string,
    stickerId: string
}
const deleteSticker = async (deleteStickerRo: DeleteStickerRo) => {
    const { stickerPackId, stickerId } = deleteStickerRo;
    const { data } = await api.stickerPacks.deleteSticker(stickerPackId, stickerId);
    return data;
};
export const useDeleteStickerMutation = (queryClient: QueryClient) =>
    useMutation<StickerRo, any, DeleteStickerRo, unknown>(deleteSticker, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, variables.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
    });
