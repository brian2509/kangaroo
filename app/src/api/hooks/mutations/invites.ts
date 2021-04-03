import { QueryClient, useMutation } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import {
    CreateInviteDto,
    InviteRoDto,
    StickerPackRo,
} from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const useInvite = async (inviteId: string) => {
    const { data } = await api.invites.useInvite(inviteId);
    return data;
};

export const useInviteMutation = (queryClient: QueryClient) =>
    useMutation<StickerPackRo, any, string, unknown>(useInvite, {
        onSuccess: () => {
            queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks);
        },
    });

const createInvite = async (
    stickerPackId: string,
    createInviteDto: CreateInviteDto,
): Promise<InviteRoDto> => {
    const { data } = await api.stickerPacks.createInvite(stickerPackId, createInviteDto || {});
    return data;
};

export const useCreateInviteMutation = (stickerPackId: string) =>
    useMutation<InviteRoDto, any, CreateInviteDto, unknown>((createInviteDto: CreateInviteDto) =>
        createInvite(stickerPackId, createInviteDto),
    );
