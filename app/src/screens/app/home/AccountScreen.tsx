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
import { sortedStickers } from "../../../util/sorting";
import { ACCOUNT_MAX_PREVIEW_STICKERS } from "../../../constants/StickerPack";

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

    const renderStickerPack = (pack: StickerPackRo): JSX.Element => {
        const stickers = sortedStickers(pack.stickers).slice(0, ACCOUNT_MAX_PREVIEW_STICKERS);

        return (
            <Layout style={tw`flex-col mb-4 shadow-md`}>
                <Layout style={tw`flex-row p-2 px-4 bg-white border-b border-gray-300`}>
                    <CoverStickerImage stickerPack={pack} style={tw`w-10 h-10 rounded-full`} />
                    <Layout style={tw`flex-col pl-4 flex-grow self-center`}>
                        <Text style={tw`font-semibold text-base`}>{pack.name}</Text>
                        <TextStatElement
                            value={pack.stickers.length}
                            text="Stickers"></TextStatElement>
                    </Layout>
                    <Text style={tw`text-gray-500 text-xs pt-2`}>
                        {lastUpdatedString(pack.updatedAt)}
                    </Text>
                </Layout>
                <Layout style={tw`flex-row flex-wrap pt-3`}>
                    {stickers.map((sticker) => {
                        return renderSticker(sticker);
                    })}
                </Layout>
            </Layout>
        );
    };

    const renderStickerView = (packs: StickerPackRo[]): JSX.Element => {
        return (
            <Layout style={tw`flex-col bg-transparent`}>
                {packs.map((pack) => {
                    return renderStickerPack(pack);
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

                    {renderStickerView(myStickerPacksQuery.data || [])}
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
};
