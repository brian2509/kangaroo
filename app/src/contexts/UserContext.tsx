import React, { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { UserPrivateRo } from "../api/generated-typescript-api-client/src";
import { api } from "../api/generatedApiWrapper";
import { useAuthContext } from "./AuthContext";

export interface UserContextProps {
    me?: UserPrivateRo;
}

export const UserContext = React.createContext<UserContextProps>({
    me: undefined,
});

interface UserContextProviderProps {
    children: ReactNode;
}
export const UserContextProvider = ({ children }: UserContextProviderProps): ReactElement => {
    const { accessToken } = useAuthContext();

    const [me, setMe] = useState<UserPrivateRo | undefined>(undefined);

    useEffect(() => {
        if (accessToken == undefined) {
            setMe(undefined);
            return;
        }

        try {
            (async () => {
                const { data } = await api.users.getOwnPrivateProfile();
                setMe(data);
            })();
        } catch {
            setMe(undefined);
        }
    }, [accessToken]);

    return (
        <UserContext.Provider
            value={{
                me,
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextProps => useContext(UserContext);
