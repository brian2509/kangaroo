import { DOMAIN_NAME, PORT } from "@env";
import axios from "axios";
import {
    AuthApi,
    Configuration,
    StickerPacksApi,
    InvitesApi,
    UserApi,
} from "./generated-typescript-api-client/src";

const baseURL = `${DOMAIN_NAME}:${PORT}`;

export const instance = axios.create({
    baseURL: `${baseURL}/api`,
});

const configuration = new Configuration();
configuration.basePath = baseURL;

export const api = {
    users: new UserApi(configuration, baseURL, instance),
    auth: new AuthApi(configuration, baseURL, instance),
    stickerPacks: new StickerPacksApi(configuration, baseURL, instance),
    invites: new InvitesApi(configuration, baseURL, instance),
};
