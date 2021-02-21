import React from "react";

export interface AccessTokenContextProps {
    accessToken: string | undefined;
    setAccessToken: (token: string) => void;
}

export const AccessTokenContext = React.createContext<AccessTokenContextProps>({
    accessToken: undefined,
    setAccessToken: (token: string) => {},
});
