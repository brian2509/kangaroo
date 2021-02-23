import "react-native-gesture-handler";
import React from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AccessTokenProvider } from "./src/contexts/AccessTokenContext";

export default (): React.ReactFragment => {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.dark}>
                <AccessTokenProvider>
                    <AppNavigator />
                </AccessTokenProvider>
            </ApplicationProvider>
        </>
    );
};
