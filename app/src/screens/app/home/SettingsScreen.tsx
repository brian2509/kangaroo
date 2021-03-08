import React from "react";
import tailwind from "tailwind-rn";
import { Linking, SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { FeedStackParamList } from "../../../navigation/AppNavigator";
import { ProfileIcon } from "../../../components/common/ProfileIcon";
import { Button, Divider, Icon, Layout, List, ListItem, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { TextStatElement } from "../../../components/common/TextStatElement";
import { AuthContext } from "../../../contexts/AuthContext";

type Props = StackScreenProps<FeedStackParamList, "SettingsScreen">;

interface settingItem {
    title: string;
    color?: string;
    onPress?: () => void;
}

export const SettingsHeader = (): React.ReactElement => {
    return (
        <Layout style={tw`w-full flex-row justify-between border-b border-gray-300 p-2 shadow-md`}>
            <Layout style={tw`flex-row bg-white`}>
                <Layout style={tw`bg-transparent ml-3`}>
                    <ProfileIcon size={14}></ProfileIcon>
                </Layout>
                <Layout style={tw`flex-col ml-4 self-center`}>
                    <Text style={tw`font-semibold mb-2`}>Willem Alexander</Text>
                    <Layout style={tw`flex-row`}>
                        <TextStatElement value={100} text="Following"></TextStatElement>
                        <TextStatElement value={100} text="Followers"></TextStatElement>
                    </Layout>
                </Layout>
            </Layout>
            <Button size="small" style={tailwind("mr-3 self-center")}>
                Share
            </Button>
        </Layout>
    );
};

const renderItem = ({ item }: { item: settingItem }) => {
    const color = item.color ?? "";
    return (
        <ListItem
            style={tw`h-10 p-0 m-0`}
            title={() => <Text style={tw`text-blue-600 ml-4 text-sm ${color}`}>{item.title}</Text>}
            accessoryRight={(props) => <Icon {...props} name="arrow-ios-forward-outline" />}
            onPress={item.onPress}
        />
    );
};

export const SettingsScreen = ({ navigation }: Props): React.ReactElement => {
    const { logout } = React.useContext(AuthContext);

    const data = [
        {
            title: "Change email",
            onPress: () =>
                navigation.navigate("SettingsUpdateScreen", { updateValueTitle: "New Email" }),
        },
        {
            title: "Change password",
            onPress: () =>
                navigation.navigate("SettingsUpdateScreen", { updateValueTitle: "New Password" }),
        },
        {
            title: "Log out",
            color: "text-red-600",
            onPress: () => logout(),
        },
    ];

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tw`flex-col h-full flex-grow justify-between bg-transparent`}>
                <Layout style={tw`bg-transparent`}>
                    <SettingsHeader></SettingsHeader>
                    <Layout style={tw`mt-2 shadow-md`}>
                        <List
                            scrollEnabled={false}
                            data={data}
                            ItemSeparatorComponent={Divider}
                            renderItem={renderItem}
                        />
                    </Layout>
                    <Button
                        appearance="ghost"
                        style={tailwind("mr-3 mt-2 self-center")}
                        onPress={() => Linking.openURL("mailto:support@example.com")}>
                        Send Feedback
                    </Button>
                </Layout>
                <Button
                    appearance="ghost"
                    status="danger"
                    style={tailwind("mr-3 mt-2 self-center")}>
                    Delete Account
                </Button>
            </Layout>
        </SafeAreaView>
    );
};
