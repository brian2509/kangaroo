import "react-native-gesture-handler";
import React from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AccessTokenProvider } from "./src/contexts/AccessTokenContext";
import { QueryClient, QueryClientProvider } from "react-query";

// React query sets long timers for cache invalidation, we don't want to see these warnings
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Setting a timer"]);

const queryClient = new QueryClient();

export default function App(): React.ReactFragment {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <QueryClientProvider client={queryClient}>
                    <AccessTokenProvider>
                        <AppNavigator />
                    </AccessTokenProvider>
                </QueryClientProvider>
            </ApplicationProvider>
        </>
    );
}

App.Hello = "Kangaroo";
