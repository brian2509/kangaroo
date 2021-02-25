import React from "react";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import tailwind from "tailwind-rn";

type Props = StackScreenProps<HomeStackParamList, "StickerDetailScreen">;

export const StickerDetailScreen = ({ route }: Props): JSX.Element => {
    const stickerPack = route.params.stickerPack;

    const renderTextWithIcon = (
        text: string,
        iconName: string,
        textTwString = "",
        isGrayed = false,
    ): JSX.Element => {
        const fill = isGrayed ? "gray" : "black";
        return (
            <Layout style={tailwind(`flex-row pr-4`)}>
                <Text style={tailwind(textTwString)}>{text}</Text>
                <Icon name={iconName} fill={fill} width={17} height={17} />
            </Layout>
        );
    };

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("flex-row justify-between p-4")}>
                <Layout style={tailwind("flex-col flex-grow justify-between")}>
                    <Text style={tailwind("font-semibold text-lg")}>{stickerPack.name}</Text>
                    <Text style={tailwind("pt-1 text-xs text-gray-500")}>
                        <Text style={tailwind("font-semibold text-xs")}>Admin</Text>: Willem
                        Alexander
                    </Text>

                    <Layout style={tailwind("pt-2")}>
                        {renderTextWithIcon(
                            "999 members",
                            "arrow-ios-forward-outline",
                            "text-xs font-semibold underline",
                        )}
                    </Layout>
                    <Layout style={tailwind("pt-3 flex-row")}>
                        {renderTextWithIcon(
                            "999",
                            "heart-outline",
                            "text-xs pr-1 text-gray-500",
                            true,
                        )}
                        {renderTextWithIcon(
                            "12k",
                            "eye-outline",
                            "text-xs pr-1 text-gray-500",
                            true,
                        )}
                    </Layout>
                </Layout>
                <Layout style={tailwind("flex-col")}>
                    <Text style={tailwind("text-gray-500")} category="p2">
                        19:09
                    </Text>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
