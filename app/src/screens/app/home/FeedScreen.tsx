import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { FeedStackParamList } from "../../../navigation/AppNavigator";
import { FeedHeader } from "../../../components/home/FeedHeader";
import { TextStatElement } from "../../../components/common/TextStatElement";
import { Button, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { CoverStickerImage } from "../../../components/common/CoverStickerImage";
import { StickerPackRo, UserRo } from "src/api/generated-typescript-api-client/src";
import { TextWithIcon } from "../../../components/common/TextWithIcon";
import { ScrollView } from "react-native-gesture-handler";

type Props = StackScreenProps<FeedStackParamList, "FeedScreen">;
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

const FeedItemHeader = ({
    userName,
    text,
    time,
}: {
    userName: string;
    text: string;
    time: string;
}): React.ReactElement => {
    return (
        <Layout style={tw`border-b border-gray-300 flex-row justify-between pb-1 pr-4`}>
            <Text style={tw`font-semibold text-xs`}>
                {userName} <Text style={tw`font-normal text-xs`}>{text}</Text>
            </Text>
            <Text style={tw`self-center text-gray-500 text-xs`}>{time}</Text>
        </Layout>
    );
};

const FeedUserLiked = ({ topMargin }: { topMargin?: string }): React.ReactElement => {
    return (
        <Layout style={tw`flex-col w-full p-2 pl-6 pr-0 ${topMargin ?? ""}`}>
            <FeedItemHeader userName="Willem" text="gave a Kangaroo" time="2h ago"></FeedItemHeader>

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

                    <Layout style={tw`flex-row mt-3`}>
                        <TextStatElement value={100} text="Kangaroos"></TextStatElement>
                        <TextStatElement value={500} text="Views"></TextStatElement>
                    </Layout>
                </Layout>
            </Layout>
        </Layout>
    );
};

const FeedStickerPack = ({ topMargin }: { topMargin?: string }): React.ReactElement => {
    return (
        <Layout style={tw`flex-col w-full p-2 pl-6 pr-0 ${topMargin ?? ""}`}>
            <FeedItemHeader
                userName="Rick"
                text="created a new shared sticker pack!"
                time="3h ago"></FeedItemHeader>

            <Layout style={tw`flex-row pt-2`}>
                <CoverStickerImage stickerPack={mockStickerPack}></CoverStickerImage>
                <Layout style={tw`flex-row flex-grow justify-between`}>
                    <Layout style={tw`flex-col pl-4`}>
                        <Text style={tw`font-semibold text-base mb-0`}>
                            Relive Fanclub <Text style={tw`text-gray-500 text-xs`}>10/30 </Text>
                        </Text>
                        <Text style={tw`text-gray-500 text-xs font-light`}>23 members</Text>
                    </Layout>
                    <Button size="tiny" style={tailwind("text-sm mr-4 self-start p-2 mt-1")}>
                        Download
                    </Button>
                </Layout>
            </Layout>
        </Layout>
    );
};

const FeedUserMilestone = ({ topMargin }: { topMargin?: string }): React.ReactElement => {
    return (
        <Layout style={tw`flex-col p-2 pl-6 pr-0 ${topMargin ?? ""}`}>
            <FeedItemHeader
                userName="Rick"
                text="reached 100 followers!"
                time="1d ago"></FeedItemHeader>

            <Layout style={tw`flex-row pt-2`}>
                <CoverStickerImage stickerPack={mockStickerPack}></CoverStickerImage>
                <Layout style={tw`flex-row flex-grow justify-between`}>
                    <Layout style={tw`flex-col pl-4`}>
                        <Text style={tw`font-semibold text-base mb-0`}>
                            Willem Alexander{" "}
                            <Text style={tw`text-gray-500 text-xs`}>@willem_alexander</Text>
                        </Text>
                        <Layout style={tw`flex-row mt-3`}>
                            <TextStatElement value={100} text="Followers"></TextStatElement>
                            <TextStatElement value={500} text="Following"></TextStatElement>
                        </Layout>
                    </Layout>
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
            <ScrollView>
                <InfoHeader></InfoHeader>
                <FeedUserLiked></FeedUserLiked>
                <FeedStickerPack topMargin="mt-2"></FeedStickerPack>
                <FeedUserMilestone topMargin="mt-2"></FeedUserMilestone>
            </ScrollView>
        </SafeAreaView>
    );
};
