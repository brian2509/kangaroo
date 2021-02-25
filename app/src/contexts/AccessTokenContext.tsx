import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import axios from "../api/axios";
import * as authApi from "../api/authApi";

export interface AccessTokenContextProps {
    accessToken: string | undefined;
    setAccessToken: (token: string | undefined) => void;
    isAuthenticated: boolean | undefined;
}

export const AccessTokenContext = React.createContext<AccessTokenContextProps>({
    accessToken: undefined,
    setAccessToken: (token: string | undefined) => {},
    isAuthenticated: undefined,
});

export const AccessTokenProvider = ({ children }: any): React.ReactElement => {
    const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | undefined>(undefined);

    useEffect(() => {
        const setStoredToken = async () => {
            const storedToken: string | null = await AsyncStorage.getItem(
                STORAGE_KEYS.accessTokenKey,
            );
            if (storedToken == null || storedToken == "") {
                // Store undefined if no valid token is found in storage
                setAccessToken(undefined);
                return;
            }
            storeAccessToken(storedToken);
        };
        setStoredToken();
    }, []);

    useEffect(() => {
        authApi
            .isAuthenticated()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, [accessToken]);

    const storeAccessToken = (newToken: string | undefined) => {
        // Set access token state
        setAccessToken(newToken);

        // Store/remove token on device
        if (newToken != undefined) {
            AsyncStorage.setItem(STORAGE_KEYS.accessTokenKey, newToken);
        } else {
            AsyncStorage.removeItem(STORAGE_KEYS.accessTokenKey);
        }

        // Set axios default authorization header
        axios.defaults.headers.common["Authorization"] = newToken
            ? "Bearer " + newToken
            : undefined;
    };

    return (
        <AccessTokenContext.Provider
            value={{
                accessToken,
                setAccessToken: storeAccessToken,
                isAuthenticated,
            }}>
            {children}
        </AccessTokenContext.Provider>
    );
};
