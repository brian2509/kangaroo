import { StackScreenProps } from "@react-navigation/stack";
import { Divider, Icon, Layout, List, ListItem } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { DiscoverStackParamList } from "src/navigation/AppNavigator";
import tailwind from "tailwind-rn";
import { UserRo } from "src/api/generated-typescript-api-client/src";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { TextStatElement } from "../../../components/common/TextStatElement";

type Props = StackScreenProps<DiscoverStackParamList, "DiscoverScreen">;

const InfoHeader = (): React.ReactElement => {
    return (
        <Layout style={tw`flex-row p-1 pl-5 bg-transparent`}>
            <TextStatElement value={100} text="Following"></TextStatElement>
            <TextStatElement value={1200} text="Followers"></TextStatElement>
        </Layout>
    );
};

const renderItem = ({ item }: { item: { title: string } }) => (
    <ListItem
        style={tw`h-10`}
        title={`${item.title}`}
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

    const mockUser: UserRo = {
        id: "0",
        username: "df",
    };
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
    });

    return (
        <SafeAreaView style={tailwind("w-full")}>
            <InfoHeader></InfoHeader>
            <List data={data} ItemSeparatorComponent={Divider} renderItem={renderItem} />
        </SafeAreaView>
    );
};
