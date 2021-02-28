import { DOMAIN_NAME, PORT } from "@env";
import instance from "./axios";
import {
    AuthApi,
    Configuration,
    StickerPacksApi,
    UserApi,
} from "./generated-typescript-api-client/src";

const baseURL = `${DOMAIN_NAME}:${PORT}`;

const configuration = new Configuration();
configuration.basePath = baseURL;

export const api = {
    users: new UserApi(configuration, baseURL, instance),
    auth: new AuthApi(configuration, baseURL, instance),
    stickerPacks: new StickerPacksApi(configuration, baseURL, instance),
};
