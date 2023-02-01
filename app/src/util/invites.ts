import { InviteRoDto } from "../api/generated-typescript-api-client/src";
import { DEEPLINK_SITE_DOMAIN } from "../constants/Deeplinking";

export const createInviteUrl = (inviteRoDto: InviteRoDto) =>
    `${DEEPLINK_SITE_DOMAIN}/invite/${inviteRoDto.id}`;
