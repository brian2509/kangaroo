import { API_DOMAIN_NAME } from "@env";
import axios from "axios";
import {
    AuthApi,
    Configuration,
    StickerPacksApi,
    UserApi,
} from "./generated-typescript-api-client/src";

const baseURL = API_DOMAIN_NAME;

export const instance = axios.create({
    baseURL: `${baseURL}/api`,
});

const configuration = new Configuration();
configuration.basePath = baseURL;

export const api = {
    users: new UserApi(configuration, baseURL, instance),
    auth: new AuthApi(configuration, baseURL, instance),
    stickerPacks: new StickerPacksApi(configuration, baseURL, instance),
};
