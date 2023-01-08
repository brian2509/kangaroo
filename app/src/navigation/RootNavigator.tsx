import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../contexts/AuthContext";
import { Layout, Text } from "@ui-kitten/components";
import { AuthStackNavigator } from "./auth/AuthStackNavigator";
import { AppStackNavigator } from "./app/AppStackNavigator";

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
    const { isAuthenticated } = React.useContext(AuthContext);

    if (isAuthenticated == undefined) {
        // TODO: Create loading page
        return (
            <Layout
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text>Loading...</Text>
            </Layout>
        );
    }

    return (
        <NavigationContainer>
            <RootStackNavigator isAuthenticated={isAuthenticated} />
        </NavigationContainer>
    );
};
