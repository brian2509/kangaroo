// https://github.com/facebook/react-native/issues/23922#issuecomment-648096619
import "react-native-url-polyfill/auto";

import "react-native-gesture-handler";
import React from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";

// React query sets long timers for cache invalidation, we don't want to see these warnings
import { LogBox } from "react-native";
import { logErrorResponse } from "./src/util/logging";
import { UserContextProvider } from "./src/contexts/UserContext";
LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            onError: logErrorResponse,
        },
        mutations: {
            onError: logErrorResponse,
        },
    },
});

export default function App(): React.ReactFragment {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <QueryClientProvider client={queryClient}>
                    <AuthContextProvider>
                        <UserContextProvider>
                            <RootNavigator />
                        </UserContextProvider>
                    </AuthContextProvider>
                </QueryClientProvider>
            </ApplicationProvider>
        </>
    );
}

App.Hello = "Kangaroo";
