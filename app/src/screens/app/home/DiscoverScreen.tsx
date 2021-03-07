import { StackScreenProps } from "@react-navigation/stack";
import { Layout } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { DiscoverStackParamList } from "src/navigation/AppNavigator";
import tailwind from "tailwind-rn";
import { UserRo } from "src/api/generated-typescript-api-client/src";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

type Props = StackScreenProps<DiscoverStackParamList, "DiscoverScreen">;

export const DiscoverScreen = ({ navigation }: Props): React.ReactElement => {
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
        <SafeAreaView style={tailwind("w-full h-full")}>
            <ScrollView></ScrollView>
        </SafeAreaView>
    );
};
