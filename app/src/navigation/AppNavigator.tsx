import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";

const { Navigator, Screen } = createStackNavigator();

export type RootStackParamList = {
    Register: undefined;
    Login: undefined;
    Homescreen: undefined;
};

export const AppNavigator = () => (
    <NavigationContainer>
        <Navigator initialRouteName="Register">
            <Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
            <Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Screen name="Homescreen" options={{ headerShown: false }} component={HomeScreen} />
        </Navigator>
    </NavigationContainer>
);
