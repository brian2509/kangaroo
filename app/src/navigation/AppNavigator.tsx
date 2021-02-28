import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { StickerScreen } from "../screens/StickerScreen";
import { StickerDetailScreen } from "../screens/StickerDetailScreen";
import { StickerDetailManageScreen } from "../screens/StickerDetailManageScreen";
import { AuthContext } from "../contexts/AuthContext";
import { Layout, Text } from "@ui-kitten/components";
import { Sticker, StickerPack } from "../api/apiTypes";

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
    StickerDetailScreen: {
        stickerPack: StickerPack;
    };
    StickerScreen: {
        sticker: Sticker;
    };
    StickerDetailManageScreen: {
        stickerPack: StickerPack;
    };
};

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="Homescreen"
            component={HomeScreen}
            options={{ title: "Sticker Packs" }}
        />
        <HomeStack.Screen
            name="StickerDetailScreen"
            component={StickerDetailScreen}
            options={{ title: "Details", headerBackTitle: " " }}
        />
        <HomeStack.Screen
            name="StickerScreen"
            component={StickerScreen}
            options={{ title: "Sticker", headerBackTitle: " " }}
        />
        <HomeStack.Screen
            name="StickerDetailManageScreen"
            component={StickerDetailManageScreen}
            options={{ title: "Group Members", headerBackTitle: " " }}
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
