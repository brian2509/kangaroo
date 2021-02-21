import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";

import { HomeScreen } from "../screens/HomeScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { TopNavigationBar } from "../common/TopNavigationBar";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const BottomTabBar = ({ navigation, state }: MaterialTopTabBarProps) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={(index) => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title="HOME" />
        <BottomNavigationTab title="REGISTER" />
        <BottomNavigationTab title="LOGIN" />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator
        swipeVelocityImpact={0.4}
        tabBar={(props: MaterialTopTabBarProps) => <BottomTabBar {...props} />}>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="Register" component={RegisterScreen} />
        <Screen name="Login" component={LoginScreen} />
    </Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <TopNavigationBar />
        <TabNavigator />
    </NavigationContainer>
);
