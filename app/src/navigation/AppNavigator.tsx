import React from "react";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/app/home/HomeScreen";
import { StickerScreen } from "../screens/app/home/stickerpack/StickerScreen";
import { StickerPackScreen } from "../screens/app/home/stickerpack/StickerPackScreen";
import { StickerPackManageScreen } from "../screens/app/home/stickerpack/StickerPackManageScreen";
import { AuthContext } from "../contexts/AuthContext";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { StickerPackRo, StickerRo, UserRo } from "../api/generated-typescript-api-client/src";
import { CreateStickerPackScreen } from "../screens/app/home/stickerpack/CreateStickerPackScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FeedScreen } from "../screens/app/home/FeedScreen";
import { AccountScreen } from "../screens/app/home/AccountScreen";
import { DiscoverScreen } from "../screens/app/home/DiscoverScreen";
import { SettingsScreen } from "../screens/app/home/SettingsScreen";
import { SettingsUpdateScreen } from "../screens/app/home/SettingsUpdateScreen";
import { CreateAddMembersScreen } from "../screens/app/home/stickerpack/CreateAddMembersScreen";
import { JoinStickerPackScreen } from "../screens/app/home/stickerpack/JoinStickerPackScreen";

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
        stickerPackId: string;
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
    JoinStickerPackScreen: {
        stickerPackId: string;
    };
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

const Tab = createBottomTabNavigator();
type TabProps = { focused: boolean; color: string; size: number };

const HomeTabNavigator = () => (
    <Tab.Navigator
        initialRouteName="SharedPacks"
        screenOptions={({ route }) => ({
            tabBarIcon: function iconForTabBar({ color }: TabProps) {
                let iconName;
                switch (route.name) {
                    case "Feed":
                        iconName = "home-outline";
                        break;
                    case "SharedPacks":
                        iconName = "message-square-outline";
                        break;
                    case "Discover":
                        iconName = "people-outline";
                        break;
                }
                return <Icon name={iconName} fill={color} width={21} height={21} />;
            },
        })}>
        <Tab.Screen name="Feed" component={FeedStackScreen} />
        <Tab.Screen name="SharedPacks" component={HomeStackScreen} />
        <Tab.Screen name="Discover" component={DiscoverStackScreen} />
    </Tab.Navigator>
);

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
        <HomeStack.Screen
            name="JoinStickerPackScreen"
            component={JoinStickerPackScreen}
            options={{ title: "Join Sticker Pack", headerBackTitle: " " }}
        />
    </HomeStack.Navigator>
);

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

type RootProps = { isAuthenticated: boolean };
const RootStack = createStackNavigator();
const RootStackScreen = ({ isAuthenticated }: RootProps) => (
    <RootStack.Navigator headerMode="none">
        {isAuthenticated ? (
            <RootStack.Screen
                name="App"
                component={HomeTabNavigator}
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

    const linkingOptions: LinkingOptions = {
        prefixes: ["kangaroo://", "https://www.stickr.cf"],
        config: {
            screens: {
                App: {
                    screens: {
                        SharedPacks: {
                            screens: {
                                initialRouteName: "SharedPacks",
                                JoinStickerPackScreen: "pack/:stickerPackId",
                            },
                        },
                    },
                },
            },
        },
    };

    return (
        <NavigationContainer linking={linkingOptions}>
            <RootStackScreen isAuthenticated={isAuthenticated} />
        </NavigationContainer>
    );
};
