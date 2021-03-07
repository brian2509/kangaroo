import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/AppNavigator";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { TextStatElement } from "../../../components/common/TextStatElement";
import { Button, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { CoverStickerImage } from "../../../components/common/CoverStickerImage";
import { StickerPackRo } from "src/api/generated-typescript-api-client/src";
import { TextWithIcon } from "../../../components/common/TextWithIcon";

type Props = StackScreenProps<HomeStackParamList, "FeedScreen">;
const mockStickerPack: StickerPackRo = {
    // TODO: replace mock with real objects
    id: "0",
    name: "giraffe",
    _private: false,
    animated: false,
    stickers: [],
    members: [],
    views: 10,
    likes: 10,
    createdAt: "10/10/2021",
    updatedAt: "10/10/2021",
};

const FeedUserLiked = ({ topMargin }: { topMargin?: string }): React.ReactElement => {
    return (
        <Layout style={tw`flex-col w-full p-2 pl-6 pr-0 ${topMargin ?? ""}`}>
            <Layout style={tw`border-b border-gray-300 flex-row justify-between pb-2 pr-4`}>
                <Text style={tw`font-semibold text-sm`}>
                    Willem <Text style={tw`font-normal text-sm`}>gave a Kangaroo</Text>
                </Text>
                <Text style={tw`self-center text-gray-500 text-xs`}>2h ago</Text>
            </Layout>

            <Layout style={tw`flex-row pt-2`}>
                <CoverStickerImage stickerPack={mockStickerPack}></CoverStickerImage>
                <Layout style={tw`flex-col pl-4 flex-grow`}>
                    <Layout style={tw`flex-row flex-grow justify-between`}>
                        <Text style={tw`font-semibold text-base`}>
                            Relive Fanclub <Text style={tw`text-gray-500 text-xs`}>10/30 </Text>
                        </Text>
                        <Layout style={tailwind("flex-row self-center")}>
                            <TextWithIcon
                                text={`100`}
                                iconName={"heart-outline"}
                                textStyle={tailwind("text-xs pr-1 text-gray-500")}
                                isGrayed={true}
                            />
                            <TextWithIcon
                                text={`23k`}
                                iconName={"eye-outline"}
                                textStyle={tailwind("text-xs pr-1 text-gray-500")}
                                isGrayed={true}
                            />
                        </Layout>
                    </Layout>

                    <Text style={tw`text-gray-500 text-xs font-light`}>23 members</Text>

                    <Layout style={tw`flex-row mt-4`}>
                        <TextStatElement value={100} text="Kangaroos"></TextStatElement>
                        <TextStatElement value={500} text="Views"></TextStatElement>
                    </Layout>
                </Layout>
            </Layout>
        </Layout>
    );
};

const FeedCreatedStickerPack = ({ topMargin }: { topMargin?: string }): React.ReactElement => {
    return (
        <Layout style={tw`flex-col w-full p-2 pl-6 pr-0 ${topMargin ?? ""}`}>
            <Layout style={tw`border-b border-gray-300 flex-row justify-between pb-2 pr-4`}>
                <Text style={tw`font-semibold text-sm`}>
                    Willem{" "}
                    <Text style={tw`font-normal text-sm`}>created a new shared sticker pack!</Text>
                </Text>
                <Text style={tw`self-center text-gray-500 text-xs`}>2h ago</Text>
            </Layout>

            <Layout style={tw`flex-row pt-2`}>
                <CoverStickerImage stickerPack={mockStickerPack}></CoverStickerImage>
                <Layout style={tw`flex-row flex-grow justify-between`}>
                    <Layout style={tw`flex-col pl-4`}>
                        <Text style={tw`font-semibold text-base mb-0`}>
                            Relive Fanclub <Text style={tw`text-gray-500 text-xs`}>10/30 </Text>
                        </Text>
                        <Text style={tw`text-gray-500 text-xs font-light`}>23 members</Text>
                    </Layout>
                    <Button style={tailwind("text-sm mr-4 self-center p-2")}>Download</Button>
                </Layout>
            </Layout>
        </Layout>
    );
};

const InfoHeader = (): React.ReactElement => {
    return (
        <Layout style={tw`flex-row p-1 pl-5 bg-transparent`}>
            <TextStatElement value={100} text="Kangaroos"></TextStatElement>
            <TextStatElement value={1200} text="Views"></TextStatElement>
            <TextStatElement value={100} text="Followers"></TextStatElement>
        </Layout>
    );
};

export const FeedScreen = ({ navigation }: Props): React.ReactElement => {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: function headerComponent() {
                return (
                    <Layout style={tw`flex-col w-full`}>
                        <FeedHeader></FeedHeader>
                    </Layout>
                );
            },
        });
    });

    return (
        <SafeAreaView style={tailwind("w-full h-full")}>
            <InfoHeader></InfoHeader>
            <FeedUserLiked></FeedUserLiked>
            <FeedCreatedStickerPack topMargin="mt-2"></FeedCreatedStickerPack>
        </SafeAreaView>
    );
};
