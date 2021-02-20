import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";

import { HomeScreen } from "../screens/HomeScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { TopNavigationBar } from "../common/TopNavigationBar";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const BottomTabBar = ({ navigation, state }: MaterialTopTabBarProps) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={(index) => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title="HOME" />
        <BottomNavigationTab title="AUTH" />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator
        tabBarPosition="bottom"
        tabBar={(props: MaterialTopTabBarProps) => <BottomTabBar {...props} />}>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="Auth" component={AuthScreen} />
    </Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <TopNavigationBar />
        <TabNavigator />
    </NavigationContainer>
);
