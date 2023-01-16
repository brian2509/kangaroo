import { StackScreenProps } from "@react-navigation/stack";
import { Button, Divider, Icon, Layout, List, ListItem, Text } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { DiscoverStackParamList } from "../../../navigation/app/AppStackNavigator";
import { UserRo } from "src/api/generated-typescript-api-client/src";
import { ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";
import { TextStatElement } from "../../../components/common/TextStatElement";
import { ProfileIcon } from "../../../components/common/ProfileIcon";

// TODO: Linking
const mockUser: UserRo = {
    id: "0",
    username: "df",
};

type Props = StackScreenProps<DiscoverStackParamList, "DiscoverScreen">;

const InfoHeader = (): React.ReactElement => {
    return (
        <Layout style={tw`flex-row p-1 pl-5 bg-transparent`}>
            <TextStatElement value={100} text="Following"></TextStatElement>
            <TextStatElement value={1200} text="Followers"></TextStatElement>
        </Layout>
    );
};

const UserAccount = (): React.ReactElement => {
    return (
        <Layout style={tw.style(`p-2 bg-white mr-2 mb-2 flex-grow shadow-md`)}>
            <Layout style={tw`flex-col`}>
                <Layout style={tw`flex-row justify-between my-2`}>
                    <Layout style={tw`border-b border-gray-300 w-9 self-center ml-3`}></Layout>
                    <Layout style={tw`bg-transparent shadow-md`}>
                        <ProfileIcon size={16}></ProfileIcon>
                    </Layout>
                    <Layout style={tw`border-b border-gray-300 w-9 self-center mr-3`}></Layout>
                </Layout>
                <Text style={tw`text-lg font-semibold`}>Willem Alexander</Text>
                <Text style={tw`text-xs text-gray-400`}>@willempie</Text>
                <Layout style={tw`flex-row mt-2`}>
                    <TextStatElement
                        style={"text-xs"}
                        value={100}
                        text="Followers"></TextStatElement>
                </Layout>
                <Text style={tw`text-xs pt-1 italic text-gray-400`}>23 shared followers</Text>
                <Button size="tiny" style={tw`text-sm p-2 mt-2 rounded-lg`}>
                    Follow
                </Button>
            </Layout>
        </Layout>
    );
};

const renderItem = ({ item }: { item: { title: string } }) => (
    <ListItem
        style={tw`h-10 p-0 m-0`}
        title={() => <Text style={tw`text-blue-600 ml-4 text-sm`}>{item.title}</Text>}
        accessoryRight={(props) => <Icon {...props} name="arrow-ios-forward-outline" />}
    />
);

export const DiscoverScreen = ({ navigation }: Props): React.ReactElement => {
    const data = [
        {
            title: "Followers",
        },
        {
            title: "Following",
        },
        {
            title: "Invitations",
        },
    ];

    useEffect(() => {
        navigation.setOptions({
            headerTitle: function headerComponent() {
                return (
                    <Layout style={tw`flex-col w-full`}>
                        <FeedHeader
                            onPress={() => {
                                // eslint-disable-next-line react/prop-types
                                navigation.navigate("AccountScreen", { account: mockUser });
                            }}></FeedHeader>
                    </Layout>
                );
            },
        });
    }, []);

    return (
        <Layout style={tw`flex-col bg-transparent h-4/5`}>
            <InfoHeader></InfoHeader>
            <Layout style={tw`shadow-md`}>
                <List
                    scrollEnabled={false}
                    data={data}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                />
            </Layout>

            <Layout style={tw`m-2 mr-0 bg-transparent`}>
                <ScrollView>
                    <Layout style={tw`flex-row flex-wrap bg-transparent`}>
                        <UserAccount></UserAccount>
                        <UserAccount></UserAccount>
                        <UserAccount></UserAccount>
                        <UserAccount></UserAccount>
                        <UserAccount></UserAccount>
                        <UserAccount></UserAccount>
                    </Layout>
                </ScrollView>
            </Layout>
        </Layout>
    );
};
