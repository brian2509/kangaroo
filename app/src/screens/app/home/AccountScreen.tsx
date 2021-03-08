import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { FeedStackParamList } from "../../../navigation/AppNavigator";
import { ProfileIcon } from "../../../components/common/ProfileIcon";
import { Icon, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { TextStatElement } from "../../../components/common/TextStatElement";

type Props = StackScreenProps<FeedStackParamList, "AccountScreen">;

export const AccountScreen = ({ navigation }: Props): React.ReactElement => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: function navigationRightIcon() {
                return (
                    <Layout style={tw`flex-row mr-4`}>
                        <TouchableOpacity
                            // activeOpacity={0.7}
                            onPress={() => navigation.navigate("SettingsScreen")}>
                            <Icon name="settings-outline" fill="black" width={25} height={25} />
                        </TouchableOpacity>
                    </Layout>
                );
            },
        });
    }, []);

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            <Layout style={tw`flex-col flex-grow`}>
                <Layout style={tw`flex-row justify-between mt-8 mb-8`}>
                    <Layout style={tw`border-b border-gray-300 w-20 self-center ml-8`}></Layout>
                    <Layout style={tw`bg-transparent shadow-md`}>
                        <ProfileIcon size={32}></ProfileIcon>
                    </Layout>
                    <Layout style={tw`border-b border-gray-300 w-20 self-center mr-8`}></Layout>
                </Layout>
                <Text style={tw`font-semibold text-2xl pl-4`}>Marco Joling</Text>
                <Text style={tw`text-gray-400 text-xs pl-4`}>@Marco_Joling</Text>
                <Layout style={tw`p-4 pt-3 flex-row`}>
                    <TextStatElement value={100} text="Following"></TextStatElement>
                    <TextStatElement value={100} text="Followers"></TextStatElement>
                    <TextStatElement value={100} text="Kangaroos"></TextStatElement>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
