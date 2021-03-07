import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/AppNavigator";
import { Text } from "react-native-svg";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { Layout } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";

type Props = StackScreenProps<HomeStackParamList, "FeedScreen">;

export const FeedScreen = ({ navigation }: Props): React.ReactElement => {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: function headerComponent() {
                return (
                    <Layout style={tw`flex-row left-0`}>
                        <FeedHeader></FeedHeader>
                    </Layout>
                );
            },
        });
    });

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Text>test</Text>
        </SafeAreaView>
    );
};
