import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { uploadSticker, UploadStickerRo } from "../../customApiWrappers";
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
    useMutation<StickerRo, any, UploadStickerRo, unknown>(uploadSticker, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, variables.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
    });

// Delete Sticker Mutation
interface DeleteStickerDto {
    stickerPackId: string,
    stickerId: string
}
const deleteSticker = async (deleteStickerRo: DeleteStickerDto) => {
    const { stickerPackId, stickerId } = deleteStickerRo;
    const { data } = await api.stickerPacks.deleteSticker(stickerPackId, stickerId);
    return data;
};
export const useDeleteStickerMutation = (queryClient: QueryClient) =>
    useMutation<StickerRo, any, DeleteStickerDto, unknown>(deleteSticker, {
        onSuccess: (data, vars) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, vars.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
    });


// Delete Sticker Mutation
interface SetStickerAsTrayIconDto {
    stickerPackId: string,
    stickerId: string
}
const setTrayIcon = async (setTrayIconDto: SetStickerAsTrayIconDto) => {
    const { stickerPackId, stickerId } = setTrayIconDto;
    const { data } = await api.stickerPacks.setTrayIconFromSticker(stickerPackId, stickerId);
    return data;
};
export const useSetTrayIconMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, SetStickerAsTrayIconDto, unknown>(setTrayIcon, {
        onSuccess: (data, vars) => {
            queryClient.invalidateQueries([QUERY_KEYS.stickerPack, vars.stickerPackId]);
            queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
        },
    });
