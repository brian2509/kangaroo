import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AccessTokenContext } from "./src/contexts/AccessTokenContext";
import AsyncStorage from "@react-native-community/async-storage";
import { KEYS } from "./src/constants/StorageKeys";
import axios from "./src/api/axios";
import { getStoredAccessToken } from "./src/util/LocalStorage";

export default (): React.ReactFragment => {
    const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        const setStoredToken = async () => {
            const storedToken: string | null = await getStoredAccessToken();

            if (storedToken == null || storedToken == "") {
                // Store undefined if no valid token is found in storage
                return setAccessToken(undefined);
            }

            storeAccessToken(storedToken);
        };

        setStoredToken();
    }, []);

    const storeAccessToken = (newToken: string | undefined) => {
        // Set access token state
        setAccessToken(newToken);

        // Store token on device
        AsyncStorage.setItem(KEYS.accessTokenKey, newToken ? newToken : "");

        // Set axios default authorization header
        axios.defaults.headers.common["Authorization"] = newToken
            ? "Bearer " + newToken
            : undefined;
    };

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <AccessTokenContext.Provider value={{ accessToken, setAccessToken: storeAccessToken }}>
                <ApplicationProvider {...eva} theme={eva.dark}>
                    <AppNavigator />
                </ApplicationProvider>
            </AccessTokenContext.Provider>
        </>
    );
};
