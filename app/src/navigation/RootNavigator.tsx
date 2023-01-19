import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthContext } from "../contexts/AuthContext";
import { Layout, Spinner } from "@ui-kitten/components";
import { AuthStackNavigator } from "./auth/AuthStackNavigator";
import { AppStackNavigator } from "./app/AppStackNavigator";
import tailwind from "tailwind-rn";
import { deepLinkingOptions } from "./deeplinking/deeplinkingOptions";

type RootStackNavigatorProps = {
    isAuthenticated: boolean
};
const RootStack = createStackNavigator();
const RootStackNavigator = ({ isAuthenticated }: RootStackNavigatorProps) => (
    <RootStack.Navigator headerMode="none">
        {isAuthenticated ? (
            <RootStack.Screen
                name="App"
                component={AppStackNavigator}
                options={{
                    animationEnabled: false,
                }}
            />
        ) : (
            <RootStack.Screen
                name="Auth"
                component={AuthStackNavigator}
                options={{
                    animationEnabled: false,
                }}
            />
        )}
    </RootStack.Navigator>
);

export const RootNavigator = (): React.ReactElement => {
    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated == undefined) {
        return (
            <Layout style={tailwind("flex-1 justify-center items-center")} >
                <Spinner size="giant" />
            </Layout >
        );
    }

    return (
        <NavigationContainer linking={deepLinkingOptions}>
            <RootStackNavigator isAuthenticated={isAuthenticated} />
        </NavigationContainer>
    );
};
