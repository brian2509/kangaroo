import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../../screens/auth/LoginScreen";
import { RegisterScreen } from "../../screens/auth/RegisterScreen";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};
const AuthStack = createStackNavigator();
export const AuthStackNavigator = (): JSX.Element => (
    <AuthStack.Navigator>
        <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
        />
        <AuthStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
        />
    </AuthStack.Navigator>
);
