import React, { ReactElement, ReactNode, useContext, useEffect } from "react";
import { api, instance } from "../api/generatedApiWrapper";
import { JwtToken } from "../api/generated-typescript-api-client/src";
import { getLocalAccessToken, updateLocalAccessToken, updateAxiosInstanceAccessToken } from "../util/access_token";

export interface AuthContextProps {
    accessToken?: string;
    isAuthenticated?: boolean;
    login: (token: JwtToken) => void;
    logout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
    accessToken: undefined,
    isAuthenticated: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    login: (token: JwtToken) => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logout: () => { },
});

interface AuthContextProviderProps {
    children: ReactNode;
}
export const AuthContextProvider = ({ children }: AuthContextProviderProps): ReactElement => {
    const [accessToken, setAccessToken] = React.useState<string | undefined>();
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | undefined>();

    useEffect(() => {
        getLocalAccessToken().then(useNewAccessToken)
    }, []);

    const useNewAccessToken = async (newToken: string | undefined) => {
        // Store token on device (remove if undefined)
        await updateLocalAccessToken(newToken);

        // Set axios default authorization header
        updateAxiosInstanceAccessToken(instance, newToken);

        // Set access token state
        setAccessToken(newToken);

        // Test and update authentication status
        if (newToken === undefined) {
            // Set auth status to false if token is not defined, skip auth request
            setIsAuthenticated(false)
        } else {
            api.auth.testAuth()
                .then(() => setIsAuthenticated(true))
                .catch(() => setIsAuthenticated(false));
        }
    };


    const login = (jwtToken: JwtToken) => {
        useNewAccessToken(jwtToken.access_token);
    };

    const logout = () => {
        useNewAccessToken(undefined);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextProps => useContext(AuthContext);
