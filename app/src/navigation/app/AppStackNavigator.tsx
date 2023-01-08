import React from "react";

import { HomeScreen } from "../../screens/app/home/HomeScreen";
import { StickerScreen } from "../../screens/app/home/stickerpack/StickerScreen";
import { StickerPackScreen } from "../../screens/app/home/stickerpack/StickerPackScreen";
import { StickerPackManageScreen } from "../../screens/app/home/stickerpack/StickerPackManageScreen";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { StickerPackRo, StickerRo, UserRo } from "../../api/generated-typescript-api-client/src";
import { CreateStickerPackScreen } from "../../screens/app/home/stickerpack/CreateStickerPackScreen";
import {
    BottomTabBarOptions,
    BottomTabBarProps,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { FeedScreen } from "../../screens/app/home/FeedScreen";
import { AccountScreen } from "../../screens/app/home/AccountScreen";
import { DiscoverScreen } from "../../screens/app/home/DiscoverScreen";
import { SettingsScreen } from "../../screens/app/home/SettingsScreen";
import { SettingsUpdateScreen } from "../../screens/app/home/SettingsUpdateScreen";
import { CreateAddMembersScreen } from "../../screens/app/home/stickerpack/CreateAddMembersScreen";
import tw from "tailwind-react-native-classnames";
import { createStackNavigator } from "@react-navigation/stack";


const BottomTabBar = ({ navigation, state }: BottomTabBarProps<BottomTabBarOptions>) => {
    const TabIcon = (props: any) => <Icon {...props} height={21} width={21} />;

    return (
        <BottomNavigation
            style={tw`py-1`}
            indicatorStyle={{ height: 2 }}
            selectedIndex={state.index}
            onSelect={(index) => navigation.navigate(state.routeNames[index])}>
            <BottomNavigationTab
                title="Feed"
                icon={(props) => <TabIcon {...props} name={"home-outline"} />}
            />
            <BottomNavigationTab
                title="SharedPacks"
                icon={(props) => <TabIcon {...props} name={"message-square-outline"} />}
            />
            <BottomNavigationTab
                title="Discover"
                icon={(props) => <TabIcon {...props} name={"people-outline"} />}
            />
        </BottomNavigation>
    );
};

export type FeedStackParamList = {
    AccountScreen: {
        account: UserRo;
    };
    StickerScreen: {
        sticker: StickerRo;
    };
    FeedScreen: {
        account: UserRo;
    };
    SettingsScreen: undefined;
    SettingsUpdateScreen: {
        updateValueTitle: string;
        onSave?: () => void;
    };
};
const FeedStack = createStackNavigator();
const FeedStackScreen = () => (
    <FeedStack.Navigator>
        <FeedStack.Screen
            name="FeedScreen"
            component={FeedScreen}
            options={{ title: " ", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{ title: "Account", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="StickerScreen"
            component={StickerScreen}
            options={{ title: "Sticker", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ title: "Settings", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="SettingsUpdateScreen"
            component={SettingsUpdateScreen}
            options={{ title: "Settings", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="DiscoverScreen"
            component={DiscoverStackScreen}
            options={{ title: " ", headerBackTitle: " " }}
        />
    </FeedStack.Navigator>
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
    CreateAddMembersScreen: {
        name: string;
        personal: boolean;
    };
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
        <HomeStack.Screen
            name="CreateAddMembersScreen"
            component={CreateAddMembersScreen}
            options={{ title: "Create Sticker Pack", headerBackTitle: " " }}
        />
    </HomeStack.Navigator>
);

export type DiscoverStackParamList = {
    DiscoverScreen: undefined;
    AccountScreen: {
        account: UserRo;
    };
    StickerScreen: {
        sticker: StickerRo;
    };
    SettingsScreen: undefined;
    SettingsUpdateScreen: {
        updateValueTitle: string;
        onSave?: () => void;
    };
};
const DiscoverStack = createStackNavigator();
const DiscoverStackScreen = () => (
    <DiscoverStack.Navigator>
        <DiscoverStack.Screen name="DiscoverScreen" component={DiscoverScreen} />
        <DiscoverStack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{ title: "Account", headerBackTitle: " " }}
        />
        <DiscoverStack.Screen
            name="StickerScreen"
            component={StickerScreen}
            options={{ title: "Sticker", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ title: "Settings", headerBackTitle: " " }}
        />
        <FeedStack.Screen
            name="SettingsUpdateScreen"
            component={SettingsUpdateScreen}
            options={{ title: "SettingsUpdate", headerBackTitle: " " }}
        />
    </DiscoverStack.Navigator>
);

const Tab = createBottomTabNavigator();
export const AppStackNavigator = (): JSX.Element => (
    <Tab.Navigator initialRouteName="Home" tabBar={(props) => <BottomTabBar {...props} />}>
        <Tab.Screen name="Feed" component={FeedStackScreen} />
        <Tab.Screen name="SharedPacks" component={HomeStackScreen} />
        <Tab.Screen name="Discover" component={DiscoverStackScreen} />
    </Tab.Navigator>
);