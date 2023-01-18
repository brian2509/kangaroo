import Config from "react-native-config";
import axios from "axios";
import {
    AuthApi,
    Configuration,
    StickerPacksApi,
    UserApi,
} from "./generated-typescript-api-client/src";
import { refreshAccessTokenInterceptor } from "./interceptors/refreshAccessToken";

const baseURL = `${Config.API_DOMAIN_NAME}`;

export const instance = axios.create({
    baseURL: `${baseURL}/api`,
});

instance.interceptors.request.use(refreshAccessTokenInterceptor);

const configuration = new Configuration();
configuration.basePath = baseURL;

export const api = {
    users: new UserApi(configuration, baseURL, instance),
    auth: new AuthApi(configuration, baseURL, instance),
    stickerPacks: new StickerPacksApi(configuration, baseURL, instance),
};
