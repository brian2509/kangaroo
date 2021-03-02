import React, { useEffect } from "react";
import { Layout, List, Text, Button, Icon, Input } from "@ui-kitten/components";
import { SafeAreaView, Image, ImageProps } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import { uploadSticker } from "../api/customApiWrappers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/ReactQueryKeys";
import { logErrorResponse } from "../util/logging";
import tailwind from "tailwind-rn";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import tw from "tailwind-react-native-classnames";
import { TouchableOpacity } from "react-native-gesture-handler";
import { api } from "../api/generatedApiWrapper";
import {
    CreateStickerPackDto,
    StickerPackRo,
    StickerRo,
} from "../api/generated-typescript-api-client/src";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

const generateName = (): string => {
    return Date.now().toString();
};

const STICKERS_IN_PREVIEW = 5;
const PLACEHOLDER_STICKER_PATH = "../placeholders/sticker_placeholder.png";

export const HomeScreen = ({ navigation }: Props): JSX.Element => {
    const { accessToken, logout } = React.useContext(AuthContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
    }, [accessToken]);

    const myStickerPacksQuery = useQuery(
        QUERY_KEYS.myStickerPacks,
        async () => (await api.users.getOwnStickerPacks()).data,
        {
            onError: logErrorResponse,
        },
    );

    const createStickerPackMutation = useMutation(
        async (createStickerPackDto: CreateStickerPackDto) =>
            (await api.stickerPacks.create(createStickerPackDto)).data,
        {
            onSuccess: (data) => {
                console.log(data);

                if (myStickerPacksQuery.data) {
                    queryClient.setQueryData(QUERY_KEYS.myStickerPacks, [
                        ...myStickerPacksQuery.data,
                        data,
                    ]);
                }
                () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
            },
            onError: logErrorResponse,
        },
    );

    const removeStickerPackMutation = useMutation(
        async (stickerPackId: string) => (await api.stickerPacks.remove(stickerPackId)).data,
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
            onError: logErrorResponse,
        },
    );

    const uploadStickerMutation = useMutation(uploadSticker, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

    const pickAndUploadSticker = async (stickerPackId: string) => {
        ImagePicker.openPicker({
            width: 512,
            height: 512,
            cropping: true,
            mediaType: "photo",
        })
            .then((image: ImageData) => {
                const stickerName = generateName();

                const file = {
                    uri: image.path,
                    name: image.path.split("/").slice(-1)[0],
                    type: image.mime,
                };

                uploadStickerMutation.mutate({ stickerPackId, stickerName, file });
            })
            .catch((error) => {
                if (error.code !== "E_PICKER_CANCELLED") {
                    console.log(error);
                }
            });
    };

    const CoverSticker = ({ stickerPack }: { stickerPack: StickerPackRo }): React.ReactElement => {
        return (
            <>
                {stickerPack.stickers.length > 0 ? (
                    <Image
                        style={tw`w-14 h-14 rounded-full`}
                        source={{
                            uri: stickerPack.stickers[0].url,
                        }}
                    />
                ) : (
                    <Image
                        style={tailwind("w-14 h-14 rounded-full")}
                        source={require(PLACEHOLDER_STICKER_PATH)}
                    />
                )}
            </>
        );
    };

    const StickerPreviews = ({ stickers }: { stickers: StickerRo[] }): React.ReactElement => {
        const stickersToPreview = stickers.slice(1, 1 + STICKERS_IN_PREVIEW);
        const stickersLeft = stickers.length - STICKERS_IN_PREVIEW - 1;

        return (
            <Layout style={tailwind("flex-row pb-1 items-center")}>
                {stickersToPreview.map((sticker) => (
                    <Layout
                        key={sticker.id}
                        style={tailwind(
                            "w-5 h-5 mx-0.5 bg-gray-200 justify-center items-center rounded",
                        )}>
                        <Image
                            style={tailwind("w-3.5 h-3.5 opacity-75")}
                            source={{
                                uri: sticker.url,
                            }}
                        />
                    </Layout>
                ))}

                {stickersLeft > 0 && (
                    <Layout
                        style={tailwind(
                            "ml-1 w-6 h-4 bg-gray-100 rounded items-center justify-center",
                        )}>
                        <Text style={tailwind("text-xs font-thin text-gray-400")}>
                            +{stickersLeft}
                        </Text>
                    </Layout>
                )}
            </Layout>
        );
    };

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

    const StickerPackStats = ({
        stickerPack,
    }: {
        stickerPack: StickerPackRo;
    }): React.ReactElement => {
        return (
            <Layout style={tailwind("flex-row")}>
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
        );
    };

    const StickerPackComponent = ({ item }: { item: StickerPackRo }) => {
        //TODO add number of notifications to stickerpacks
        const numberOfNotifications = 1;

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate("StickerDetailScreen", {
                        stickerPack: item,
                    });
                }}>
                <Layout style={tailwind("flex-row w-full h-20 bg-white")}>
                    <Layout style={tailwind("w-20 mx-1 justify-center items-center")}>
                        <CoverSticker stickerPack={item} />
                    </Layout>
                    <Layout
                        style={tailwind(
                            "flex-row flex-grow py-2 pr-4 border-b border-gray-100 justify-between",
                        )}>
                        <Layout style={tailwind("flex-col justify-around")}>
                            <Text style={tailwind("text-base font-semibold")}>{item.name}</Text>
                            <StickerPreviews stickers={item.stickers} />
                            <StickerPackStats stickerPack={item} />
                        </Layout>
                        <Layout style={tailwind("flex-col items-end")}>
                            <Text style={tailwind("pb-2 py-1 text-gray-500")} category="p2">
                                19:09
                            </Text>
                            {numberOfNotifications > 0 && (
                                <Layout
                                    style={tailwind(
                                        "w-5 h-5 rounded-full bg-blue-600 justify-center items-center",
                                    )}>
                                    <Text style={tailwind("text-white text-xs")}>
                                        {numberOfNotifications}
                                    </Text>
                                </Layout>
                            )}
                        </Layout>
                    </Layout>
                </Layout>
            </TouchableOpacity>
        );
    };

    const AddIcon = (props: any) => (
        <Icon style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })} name="plus" />
    );
    const LogoutIcon = (props: any) => (
        <Icon
            style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })}
            name="person-delete-outline"
        />
    );

    const HeaderIcons = () => (
        <Layout style={tailwind("flex-row self-start bg-transparent")}>
            <Button
                appearance="ghost"
                style={tailwind("px-1")}
                onPress={() =>
                    createStickerPackMutation.mutate({
                        name: generateName(),
                        private: true,
                    })
                }
                accessoryLeft={AddIcon}
            />
            <Button
                appearance="ghost"
                status="danger"
                onPress={logout}
                accessoryLeft={LogoutIcon}
            />
        </Layout>
    );

    const Header = () => (
        <Layout style={tailwind("p-5 pb-3 pt-1 bg-gray-100")}>
            <Layout
                style={tailwind("flex-row justify-between pt-2 pb-1 bg-transparent items-center")}>
                <Text style={tailwind("text-4xl font-semibold bg-transparent")}>Sticker Packs</Text>
                <HeaderIcons />
            </Layout>
            <Input
                accessoryLeft={(props: any) => <Icon {...props} name="search" />}
                style={tw`rounded-xl`}
                placeholder="Search"
            />
        </Layout>
    );

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Header />
            <Layout style={tailwind("flex-1")}>
                <List
                    style={tailwind("w-full")}
                    data={myStickerPacksQuery.data}
                    renderItem={StickerPackComponent}
                    refreshing={
                        myStickerPacksQuery.isLoading ||
                        createStickerPackMutation.isLoading ||
                        removeStickerPackMutation.isLoading
                    }
                    onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}
                />
            </Layout>
        </SafeAreaView>
    );
};
