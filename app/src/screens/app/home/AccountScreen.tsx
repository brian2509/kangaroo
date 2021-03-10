import React, { useEffect } from "react";
import { Image, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { FeedStackParamList } from "../../../navigation/AppNavigator";
import { Icon, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { TextStatElement } from "../../../components/common/TextStatElement";
import { AccountProfileImage } from "../../../components/common/AccountProfileImage";
import { useQueryClient } from "react-query";
import { useMe } from "../../../api/hooks/query/user";
import { useStickerPacks } from "../../../api/hooks/query/stickerPack";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { CoverStickerImage } from "../../../components/common/CoverStickerImage";
import { StickerPackRo, StickerRo } from "../../../api/generated-typescript-api-client/src";
import { ScrollView } from "react-native-gesture-handler";
import { lastUpdatedString } from "../../../util/time";
import { sortedStickerPacks, sortedStickers } from "../../../util/sorting";
import { ACCOUNT_MAX_PREVIEW_STICKERS } from "../../../constants/StickerPack";
import { TextWithIcon } from "../../../components/common/TextWithIcon";

type Props = StackScreenProps<FeedStackParamList, "AccountScreen">;

export const AccountScreen = ({ navigation }: Props): React.ReactElement => {
    const queryClient = useQueryClient();
    const myUserQuery = useMe();
    const myStickerPacksQuery = useStickerPacks();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.me);
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);

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

    const renderSticker = (sticker: StickerRo): JSX.Element => {
        return (
            <TouchableOpacity
                key={sticker.id}
                style={{
                    width: "21%",
                    height: "auto",
                    marginHorizontal: "2%",
                    marginBottom: "3.5%",
                }}
                onPress={() => {
                    navigation.navigate("StickerScreen", { sticker });
                }}>
                <Image
                    style={tw.style("rounded-lg", {
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 3,
                    })}
                    source={{
                        uri: sticker.fileUrl,
                    }}
                />
            </TouchableOpacity>
        );
    };

    const renderStickers = (stickers: StickerRo[]): JSX.Element => {
        return (
            <Layout>
                <Layout style={tw`flex-row flex-wrap pt-3 px-1 border-b border-gray-300`}>
                    {stickers.map((sticker) => {
                        return renderSticker(sticker);
                    })}
                </Layout>
            </Layout>
        );
    };

    const showEmptyPackPreview = (): JSX.Element => {
        return (
            <Layout>
                <Text style={tw`text-gray-400 self-center py-4`}>This pack is empty!</Text>
            </Layout>
        );
    };

    const renderPackInfo = (pack: StickerPackRo): JSX.Element => {
        return (
            <Layout style={tw`flex-row justify-between`}>
                <Layout style={tw`flex-row justify-between w-1/3 p-2 pl-4`}>
                    <TouchableOpacity>
                        <Icon name="heart-outline" fill="gray" width={25} height={25} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="paper-plane-outline" fill="gray" width={25} height={25} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="upload" fill="gray" width={25} height={25} />
                    </TouchableOpacity>
                </Layout>
                <Layout style={tw`flex-row self-center`}>
                    <TextWithIcon
                        text={`${pack.likes}`}
                        iconName={"heart-outline"}
                        textStyle={tw`text-xs pr-1 text-gray-500`}
                        isGrayed={true}
                    />
                    <TextWithIcon
                        text={`${pack.views}`}
                        iconName={"eye-outline"}
                        textStyle={tw`text-xs pr-1 text-gray-500`}
                        isGrayed={true}
                    />
                </Layout>
            </Layout>
        );
    };

    const renderStickerPackPreview = (pack: StickerPackRo): JSX.Element => {
        const stickers = sortedStickers(pack.stickers).slice(0, ACCOUNT_MAX_PREVIEW_STICKERS);

        return (
            <Layout style={tw`flex-col mb-4 shadow-md`}>
                <Layout style={tw`flex-row p-2 px-4 bg-white border-b border-gray-300`}>
                    <CoverStickerImage stickerPack={pack} style={tw`w-10 h-10 rounded-full`} />
                    <Layout style={tw`flex-col pl-4 flex-grow self-center flex-wrap w-full`}>
                        <Text numberOfLines={1} style={tw`font-semibold text-base w-4/5`}>
                            {pack.name}
                        </Text>
                        <Layout style={tw`flex-row`}>
                            <TextStatElement
                                value={pack.stickers.length}
                                text={pack.stickers.length == 1 ? "Sticker" : "Stickers"}
                            />
                            <TextStatElement
                                value={pack.members.length}
                                text={pack.members.length == 1 ? "Member" : "Members"}
                            />
                        </Layout>
                    </Layout>
                    <Text style={tw`text-gray-500 text-xs pt-2`}>
                        {lastUpdatedString(pack.updatedAt)}
                    </Text>
                </Layout>
                {stickers.length > 0 ? renderStickers(stickers) : showEmptyPackPreview()}
                {stickers.length > 0 ? renderPackInfo(pack) : null}
            </Layout>
        );
    };

    const renderStickerPackPreviews = (packs: StickerPackRo[]): JSX.Element => {
        return (
            <Layout style={tw`flex-col bg-transparent`}>
                {packs.map((pack) => {
                    return renderStickerPackPreview(pack);
                })}
            </Layout>
        );
    };

    return (
        <SafeAreaView>
            <ScrollView style={tw`w-full`}>
                <Layout style={tw`flex-col flex-grow bg-transparent`}>
                    <AccountProfileImage></AccountProfileImage>

                    <Text style={tw`font-semibold text-2xl pl-4`}>
                        {myUserQuery.data?.username || ""}
                    </Text>
                    <Text style={tw`text-gray-400 text-xs pl-4`}>
                        @{myUserQuery.data?.id || ""}
                    </Text>
                    <Layout style={tw`p-4 pt-3 flex-row bg-transparent`}>
                        <TextStatElement value={100} text="Following"></TextStatElement>
                        <TextStatElement value={100} text="Followers"></TextStatElement>
                        <TextStatElement
                            value={myStickerPacksQuery.data?.length || 0}
                            text="Stickerpacks"></TextStatElement>
                    </Layout>

                    {renderStickerPackPreviews(sortedStickerPacks(myStickerPacksQuery.data || []))}
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
};
