import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/app/home/HomeScreen";
import { StickerScreen } from "../screens/app/home/stickerpack/StickerScreen";
import { StickerPackScreen } from "../screens/app/home/stickerpack/StickerPackScreen";
import { StickerPackManageScreen } from "../screens/app/home/stickerpack/StickerPackManageScreen";
import { AuthContext } from "../contexts/AuthContext";
import { Layout, Text } from "@ui-kitten/components";
import { StickerPackRo, StickerRo } from "../api/generated-typescript-api-client/src";
import { CreateStickerPackScreen } from "../screens/app/home/stickerpack/CreateStickerPackScreen";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};
const AuthStack = createStackNavigator();
export const AuthStackScreen = (): JSX.Element => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <AuthStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
        />
    </AuthStack.Navigator>
);

export type HomeStackParamList = {
    Homescreen: undefined;
    StickerPackDetailScreen: {
        stickerPack: StickerPackRo;
    };
    StickerPackManageScreen: {
        stickerPack: StickerPackRo;
    };
    StickerScreen: {
        sticker: StickerRo;
    };
    CreateStickerPackScreen: undefined;
};

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="Homescreen"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
        <HomeStack.Screen
            name="StickerPackDetailScreen"
            component={StickerPackScreen}
            options={{ title: "Details", headerBackTitle: " " }}
        />
        <HomeStack.Screen
            name="StickerScreen"
            component={StickerScreen}
            options={{ title: "Sticker", headerBackTitle: " " }}
        />
        <HomeStack.Screen
            name="StickerPackManageScreen"
            component={StickerPackManageScreen}
            options={{ title: "Group Members", headerBackTitle: " " }}
        />
        <HomeStack.Screen
            name="CreateStickerPackScreen"
            component={CreateStickerPackScreen}
            options={{ title: "Create Sticker Pack", headerBackTitle: " " }}
        />
    </HomeStack.Navigator>
);

type RootProps = { isAuthenticated: boolean };
const RootStack = createStackNavigator();
const RootStackScreen = ({ isAuthenticated }: RootProps) => (
    <RootStack.Navigator headerMode="none">
        {isAuthenticated ? (
            <RootStack.Screen
                name="App"
                component={HomeStackScreen}
                options={{
                    animationEnabled: false,
                }}
            />
        ) : (
            <RootStack.Screen
                name="Auth"
                component={AuthStackScreen}
                options={{
                    animationEnabled: false,
                }}
            />
        )}
    </RootStack.Navigator>
);

export const AppNavigator = (): React.ReactElement => {
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
            <RootStackScreen isAuthenticated={isAuthenticated} />
        </NavigationContainer>
    );
};
