import React, { useContext, useEffect, useState } from "react";
import { UserPrivateRo } from "../api/generated-typescript-api-client/src";
import { api } from "../api/generatedApiWrapper";
import { AuthContext } from "./AuthContext";

export interface UserContextProps {
    me: UserPrivateRo | undefined;
}

export const UserContext = React.createContext<UserContextProps>({
    me: undefined,
});

export const UserContextProvider = ({ children }: any): React.ReactElement => {
    const { accessToken } = useContext(AuthContext);

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
