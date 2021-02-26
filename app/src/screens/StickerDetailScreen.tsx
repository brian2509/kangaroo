import React from "react";
import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { Image, SafeAreaView, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import tailwind from "tailwind-rn";
import { Sticker, StickerPack } from "src/api/apiTypes";

type Props = StackScreenProps<HomeStackParamList, "StickerDetailScreen">;

export const StickerDetailScreen = ({ route }: Props): JSX.Element => {
    const stickerPack: StickerPack = route.params.stickerPack;
    const defaultFrontStickerPath = "../placeholders/sticker_placeholder.png";

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

    const fetchStickerPackIcon = (): JSX.Element => {
        if (stickerPack.stickers.length > 0) {
            const sticker = stickerPack.stickers[0];
            return (
                <Image
                    key={sticker.id}
                    style={tailwind("h-20 w-20 mr-3 rounded-lg")}
                    source={{
                        uri: sticker.url,
                    }}
                />
            );
        } else {
            return (
                <Image
                    style={tailwind("h-20 w-20 mr-3 rounded-lg")}
                    source={require("../placeholders/sticker_placeholder.png")}
                />
            );
        }
    };

    const renderHeader = (): JSX.Element => {
        return (
            <Layout style={tailwind("flex-row justify-between p-4 pb-3 border-b border-gray-300")}>
                {fetchStickerPackIcon()}
                <Layout style={tailwind("flex-col flex-grow justify-between")}>
                    <Text style={tailwind("font-semibold text-lg")}>{stickerPack.name}</Text>
                    <Text style={tailwind("text-xs text-gray-500")}>
                        <Text style={tailwind("font-semibold text-xs")}>Admin</Text>: Willem
                        Alexander
                    </Text>
                    <Layout style={tailwind("pt-1")}>
                        {renderTextWithIcon(
                            `${stickerPack.members.length} members`,
                            "arrow-ios-forward-outline",
                            "text-xs font-semibold",
                        )}
                    </Layout>
                    <Layout style={tailwind("pt-2 flex-row")}>
                        {renderTextWithIcon(
                            `${stickerPack.likes}`,
                            "heart-outline",
                            "text-xs pr-1 text-gray-500",
                            true,
                        )}
                        {renderTextWithIcon(
                            `${stickerPack.views}`,
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
        );
    };

    const renderSticker = (sticker: Sticker): JSX.Element => {
        return (
            <Image
                key={sticker.id}
                style={tailwind("h-20 w-20 mr-3 rounded-lg")}
                source={{
                    uri: sticker.url,
                }}
            />
        );
    };

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("flex-col flex-grow")}>
                {renderHeader()}
                <ScrollView style={tailwind("p-4 pt-5")}>
                    <Layout style={tailwind("flex-row items-end items-baseline")}>
                        <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                        <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                            {stickerPack.stickers.length}/30
                        </Text>
                    </Layout>
                    <Layout style={tailwind("flex-col p-2")}>
                        <Layout
                            style={tailwind("flex-row flex-grow justify-between items-baseline")}>
                            <Text style={tailwind("font-semibold mr-4")}>Willem Alexander</Text>
                            <Text style={tailwind("text-gray-500 pt-3 text-xs")}>
                                Last updated Wed 4:20
                            </Text>
                        </Layout>
                        <Layout style={tailwind("flex-row flex-wrap pt-3")}>
                            {stickerPack.stickers.map((sticker) => {
                                return renderSticker(sticker);
                            })}
                        </Layout>
                    </Layout>
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
};
