import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import { api, instance } from "../api/generatedApiWrapper";
import { JwtToken } from "../api/generated-typescript-api-client/src";

export interface AuthContextProps {
    accessToken: string | undefined;
    isAuthenticated: boolean | undefined;
    login: (token: JwtToken) => void;
    logout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
    accessToken: undefined,
    isAuthenticated: undefined,
    login: (token: JwtToken) => {},
    logout: () => {},
});

export const AuthContextProvider = ({ children }: any): React.ReactElement => {
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
        if (accessToken == undefined) {
            setIsAuthenticated(false);
            return;
        }

        api.auth
            .testAuth()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, [accessToken]);

    const storeAccessToken = (newToken: string | undefined) => {
        // Store/remove token on device
        if (newToken != undefined) {
            AsyncStorage.setItem(STORAGE_KEYS.accessTokenKey, newToken);
        } else {
            AsyncStorage.removeItem(STORAGE_KEYS.accessTokenKey);
        }

        // Set axios default authorization header
        instance.defaults.headers.common["Authorization"] = newToken
            ? "Bearer " + newToken
            : undefined;

        // Set access token state
        setAccessToken(newToken);
    };

    const logout = () => {
        storeAccessToken(undefined);
    };

    const login = (jwtToken: JwtToken) => {
        storeAccessToken(jwtToken.access_token);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated,
                logout,
                login,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
