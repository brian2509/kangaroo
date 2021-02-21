import "react-native-gesture-handler";
import React from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AccessTokenContext } from "./src/contexts/AccessTokenContext";

export default (): React.ReactFragment => {
    const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
                <ApplicationProvider {...eva} theme={eva.dark}>
                    <AppNavigator />
                </ApplicationProvider>
            </AccessTokenContext.Provider>
        </>
    );
};
