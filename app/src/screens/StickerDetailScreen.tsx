import React from "react";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { Image, SafeAreaView, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import tailwind from "tailwind-rn";
import { Sticker, StickerPack } from "src/api/apiTypes";
import tw from "tailwind-react-native-classnames";

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

    const renderFrontSticker = (): JSX.Element => {
        const style = tw.style("w-16 h-16 mr-3 rounded-lg");
        if (stickerPack.stickers.length === 0) {
            return <Image style={style} source={require(defaultFrontStickerPath)} />;
        } else {
            const sticker = stickerPack.stickers[0];
            return <Image style={style} source={{ uri: sticker.url }} />;
        }
    };

    const renderSticker = (sticker: Sticker): JSX.Element => {
        return (
            <Image
                key={sticker.id}
                style={tw.style("rounded-lg", {
                    width: "21%",
                    paddingBottom: "21%",
                    marginHorizontal: "2%",
                    marginBottom: "2%",
                    borderRadius: 3,
                })}
                resizeMode="contain"
                source={{
                    uri: sticker.url,
                }}
            />
        );
    };

    class AuthorView extends React.Component {
        render() {
            return (
                <Layout style={tailwind("flex-col p-2")}>
                    <Layout style={tailwind("flex-row flex-grow justify-between items-baseline")}>
                        <Text style={tailwind("font-semibold mr-4")}>
                            Willem Alexander
                            <Text style={tailwind("text-xs text-gray-500")}>
                                {" "}
                                ({stickerPack.stickers.length})
                            </Text>
                        </Text>
                        <Text style={tailwind("text-gray-500 pt-3 text-xs")}>Wed 4:20</Text>
                    </Layout>
                    <Layout style={tw`flex-row flex-wrap pt-3`}>
                        {stickerPack.stickers.map((sticker) => {
                            return renderSticker(sticker);
                        })}
                    </Layout>
                </Layout>
            );
        }
    }

    class Header extends React.Component {
        render() {
            return (
                <Layout
                    style={tailwind("flex-row justify-between p-4 pb-3 border-b border-gray-300")}>
                    {renderFrontSticker()}
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
        }
    }

    class Body extends React.Component {
        render() {
            return (
                <ScrollView style={tailwind("p-4 pt-3")}>
                    <Layout style={tailwind("flex-row items-end items-baseline")}>
                        <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                        <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                            {stickerPack.stickers.length}/30
                        </Text>
                    </Layout>
                    <AuthorView />
                </ScrollView>
            );
        }
    }

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("flex-col flex-grow")}>
                <Header />
                <Body />
            </Layout>
        </SafeAreaView>
    );
};
