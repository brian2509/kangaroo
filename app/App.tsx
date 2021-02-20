import "react-native-gesture-handler";
import React from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default (): React.ReactFragment => (
    <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark}>
            <AppNavigator />
        </ApplicationProvider>
    </>
);
