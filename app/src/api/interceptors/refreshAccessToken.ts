import { AxiosRequestConfig } from "axios";
import { getLocalAccessToken } from "../../util/access_token";
import { isJwtTokenExpired } from "../../util/token_expiration";
import { api } from "../generatedApiWrapper";

export const refreshAccessTokenInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    if (config.url?.endsWith("api/auth/refresh")) {
        // Skipping interceptor for refresh call
        return config;
    }

    let authHeader = config.headers.common["Authorization"];

    // No auth header, no need to refresh token, return old config
    if (!authHeader) {
        const storedAccessToken = await getLocalAccessToken();
        if (!storedAccessToken) return config;

        config.headers.common["Authorization"] = `Bearer ${storedAccessToken}`;
        authHeader = config.headers.common["Authorization"];
    }

    const token = authHeader.split(" ")[1];
    const expired = isJwtTokenExpired(token);

    // Token is valid, return old config
    if (!expired) return config;

    console.log("Refreshing access token");
    const { data } = await api.auth.refresh();

    if (!data) return config;
    
    const refreshedToken = data.access_token;
    config.headers.common["Authorization"] = `Bearer ${refreshedToken}`;

    return config;
}