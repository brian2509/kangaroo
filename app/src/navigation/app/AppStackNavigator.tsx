import React from "react";

import { HomeScreen } from "../../screens/app/home/HomeScreen";
import { StickerPackScreen } from "../../screens/app/home/stickerpack/StickerPackScreen";
import { StickerPackManageScreen } from "../../screens/app/home/stickerpack/StickerPackManageScreen";
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import { CreateStickerPackScreen } from "../../screens/app/home/stickerpack/CreateStickerPackScreen";
import { CreateAddMembersScreen } from "../../screens/app/home/stickerpack/CreateAddMembersScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { SettingsScreen } from "../../screens/app/home/settings/SettingsScreen";
import StickerScreen from "../../screens/app/home/stickerpack/StickerScreen";
import { SettingsUpdateScreen } from "../../screens/app/home/settings/SettingsUpdateScreen";
import { PrivacyPolicyScreen } from "../../screens/app/home/settings/PrivacyPolicyScreen";

export type HomeStackParamList = {
    Homescreen: undefined;
    StickerPackScreen: {
        stickerPack: StickerPackRo;
    };
    StickerPackManageScreen: {
        stickerPack: StickerPackRo;
    };
    StickerScreen: {
        sticker: StickerRo;
        stickerPack: StickerPackRo;
        allowDeleteSticker?: boolean;
        allowSetAsTrayIcon?: boolean;
    };
    CreateStickerPackScreen: undefined;
    CreateAddMembersScreen: {
        name: string;
        personal: boolean;
    };
    SettingsScreen: undefined,
    SettingsUpdateScreen: {
        updateValueKey: "password" | "email"
    },
    PrivacyPolicyScreen: undefined,
};
const AppStack = createStackNavigator();
export const AppStackNavigator = (): JSX.Element => (
    <AppStack.Navigator>
        <AppStack.Screen
            name="Homescreen"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
        <AppStack.Screen
            name="StickerPackScreen"
            component={StickerPackScreen}
            options={{ title: "Stickers", headerTitleAlign: "center" }}
        />
        <AppStack.Screen
            name="StickerScreen"
            component={StickerScreen}
            options={{ title: "Sticker", headerTitleAlign: "center" }}
        />
        <AppStack.Screen
            name="StickerPackManageScreen"
            component={StickerPackManageScreen}
            options={{ title: "Group Members", headerTitleAlign: "center" }}
        />
        <AppStack.Screen
            name="CreateStickerPackScreen"
            component={CreateStickerPackScreen}
            options={{ title: "Create Sticker Pack" }}
        />
        <AppStack.Screen
            name="CreateAddMembersScreen"
            component={CreateAddMembersScreen}
            options={{ title: "Create Sticker Pack" }}
        />
        <AppStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ title: "Settings" }}
        />
        <AppStack.Screen
            name="SettingsUpdateScreen"
            component={SettingsUpdateScreen}
        />
        <AppStack.Screen
            name="PrivacyPolicyScreen"
            component={PrivacyPolicyScreen}
            options={{ title: "Privacy Policy" }}
        />
    </AppStack.Navigator>
);
