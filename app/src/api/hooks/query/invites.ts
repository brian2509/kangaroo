import { QueryClient, useQuery } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { StickerPackRo } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const getInvitePreview = async (inviteId: string) => {
    const { data } = await api.invites.previewInvite(inviteId);
    return data;
};

export const useInvitePreview = (queryClient: QueryClient, inviteId: string) =>
    useQuery<StickerPackRo, any, StickerPackRo>(
        [QUERY_KEYS.invitePreview, inviteId],
        () => getInvitePreview(inviteId),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks);
                queryClient.invalidateQueries([QUERY_KEYS.stickerPack, data.id]);
            },
        },
    );
