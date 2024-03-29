import React from "react";
import tailwind from "tailwind-rn";
import { Linking, SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileIcon } from "../../../../components/common/ProfileIcon";
import { Button, Divider, Icon, Layout, List, ListItem, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import { showConfirmModal } from "../../../../components/common/ConfirmModal";
import { useQueryClient } from "react-query";

type Props = StackScreenProps<HomeStackParamList, "SettingsScreen">;

interface SettingItem {
    title: string;
    color?: string;
    onPress?: () => void;
}
export const SettingsHeader = ({ username }: { username: string }): React.ReactElement => {
    return (
        <Layout style={tw`w-full flex-row items-center border-gray-300 p-4 my-4 shadow-md`}>
            <Layout style={tw`mr-4`}>
                <ProfileIcon size={14} />
            </Layout>
            <Text style={tw`font-bold text-xl`}>{username}</Text>
        </Layout>
    );
};

const SettingListItem = ({ item }: { item: SettingItem }) => {
    const color = item.color ?? "";
    return (
        <ListItem
            style={tw`p-3 m-0`}
            title={() => <Text style={tw`ml-2 text-base ${color}`}>{item.title}</Text>}
            accessoryRight={(props) => <Icon {...props} name="arrow-ios-forward-outline" />}
            onPress={item.onPress}
        />
    );
};

export const SettingsScreen = ({ navigation }: Props): React.ReactElement => {
    const { logout } = useAuthContext();

    const queryClient = useQueryClient();

    const onPressLogout = () => {
        const onPressConfirm = async () => {
            logout();
            queryClient.clear();
        }

        showConfirmModal({
            message: "Are you sure?",
            buttonText: "Logout",
            onPressConfirm,
            status: "danger"
        });
    }

    const settingsList = [
        {
            title: "Change password",
            onPress: () => navigation.navigate("SettingsUpdateScreen", { updateValueKey: "password" }),
        },
        {
            title: "Privacy Policy",
            onPress: () => navigation.navigate("PrivacyPolicyScreen"),
        },
    ];

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tw`flex-col h-full justify-between items-center bg-transparent`}>
                <Layout style={tw`w-full bg-transparent`}>
                    <Layout style={tw`shadow-md`}>
                        <List
                            scrollEnabled={false}
                            data={settingsList}
                            ItemSeparatorComponent={Divider}
                            renderItem={SettingListItem}
                        />
                    </Layout>
                    <Button
                        style={tailwind("m-8 mt-12 rounded-xl")}
                        status="danger"
                        size="large"
                        onPress={onPressLogout}
                    >
                        Logout
                    </Button>
                </Layout>
                <Layout style={tailwind("bg-transparent")}>
                    <Button
                        appearance="ghost"
                        onPress={() => Linking.openURL("mailto:support@example.com")}>
                        Send Feedback
                    </Button>
                    <Button
                        appearance="ghost"
                        status="danger"
                        style={tailwind("mb-6 mt-2 self-center")}>
                        Delete Account
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView >
    );
};
