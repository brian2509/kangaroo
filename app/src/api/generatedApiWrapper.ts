import Config from "react-native-config";
import axios from "axios";
import {
    AuthApi,
    Configuration,
    InvitesApi,
    StickerPacksApi,
    UserApi,
} from "./generated-typescript-api-client/src";

const baseURL = `${Config.API_DOMAIN_NAME}`;

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
