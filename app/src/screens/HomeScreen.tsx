import React, { useEffect } from "react";
import { Layout, List, Text, Button, Icon, Input } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet, Image } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import API from "../api/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Sticker, StickerPack } from "../api/apiTypes";
import { QUERY_KEYS } from "../constants/ReactQueryKeys";
import { logErrorResponse } from "../util/logging";
import tailwind from "tailwind-rn";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import tw from "tailwind-react-native-classnames";
import { TouchableOpacity } from "react-native-gesture-handler";

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

    const myStickerPacksQuery = useQuery(QUERY_KEYS.myStickerPacks, API.fetchMyStickerPacks, {
        onError: logErrorResponse,
    });

    const addStickerPackMutation = useMutation(API.addStickerPack, {
        onSuccess: (data) => {
            if (myStickerPacksQuery.data) {
                queryClient.setQueryData(QUERY_KEYS.myStickerPacks, [
                    ...myStickerPacksQuery.data,
                    data,
                ]);
            }
        },
        onError: logErrorResponse,
    });

    const deleteStickerPackMutation = useMutation(API.deleteStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

    const uploadStickerMutation = useMutation(API.uploadSticker, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

    const pickAndUploadSticker = async (stickerPackId: string) => {
        try {
            ImagePicker.openPicker({
                width: 512,
                height: 512,
                cropping: true,
                mediaType: "photo",
            }).then((image: ImageData) => {
                const stickerName = generateName();

                const formData = new FormData();
                formData.append("name", stickerName);
                formData.append("file", {
                    name: image.path.split("/").slice(-1)[0],
                    size: image.size,
                    type: image.mime,
                    uri: image.path,
                    width: image.width,
                    height: image.height,
                });

                // Leaving this in, we might need this uri for iOS:
                // const uri = Platform.OS === "android" ? image.path : "file://" + image.path;

                uploadStickerMutation.mutate({ stickerPackId, formData });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderItemAccessory = (stickerPack: StickerPack) => {
        const UploadIcon = (props: any) => <Icon {...props} name="upload" />;
        const TrashIcon = (props: any) => <Icon {...props} name="trash" />;

        return (
            <>
                <Button
                    status="success"
                    appearance="outline"
                    onPress={() => pickAndUploadSticker(stickerPack.id)}
                    accessoryLeft={UploadIcon}
                />
                <Button
                    status="danger"
                    appearance="outline"
                    onPress={() => deleteStickerPackMutation.mutate({ id: stickerPack.id })}
                    accessoryLeft={TrashIcon}
                />
            </>
        );
    };

    const CoverSticker = ({ stickerPack }: { stickerPack: StickerPack }): React.ReactElement => {
        return (
            <>
                {stickerPack.stickers.length > 0 ? (
                    <Image
                        style={tw`w-16 h-16 rounded`}
                        source={{
                            uri: stickerPack.stickers[0].url,
                        }}
                    />
                ) : (
                    <Image
                        style={tailwind("w-16 h-16 rounded")}
                        source={require(PLACEHOLDER_STICKER_PATH)}
                    />
                )}
            </>
        );
    };

    const StickerPreviews = ({ stickers }: { stickers: Sticker[] }): React.ReactElement => {
        const stickersToPreview = stickers.slice(1, 1 + STICKERS_IN_PREVIEW);
        const stickersLeft = stickers.length - STICKERS_IN_PREVIEW - 1;

        return (
            <Layout style={tailwind("flex-row items-center")}>
                {stickersToPreview.map((sticker) => (
                    <Image
                        key={sticker.id}
                        style={tailwind("w-6 h-6 rounded mx-0.5 opacity-75")}
                        source={{
                            uri: sticker.url,
                        }}
                    />
                ))}

                {stickersLeft > 0 && (
                    <Layout
                        style={tailwind(
                            "ml-1 w-8 h-5 bg-gray-100 rounded items-center justify-center",
                        )}>
                        <Text style={tailwind("text-xs")}>+{stickersLeft}</Text>
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
        stickerPack: StickerPack;
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

    const StickerPackComponent = ({ item }: { item: StickerPack }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate("StickerDetailScreen", {
                        stickerPack: item,
                    });
                }}>
                <Layout style={tailwind("flex-row w-full h-24 bg-white")}>
                    <Layout style={tailwind("w-24 justify-center items-center")}>
                        <CoverSticker stickerPack={item} />
                    </Layout>
                    <Layout
                        style={tailwind("flex-col justify-between py-2 border-b border-gray-100")}>
                        <Text style={tailwind("text-base font-bold")}>{item.name}</Text>
                        <StickerPreviews stickers={item.stickers} />
                        <StickerPackStats stickerPack={item} />
                    </Layout>
                </Layout>
            </TouchableOpacity>
        );
    };

    const AddIcon = (props: any) => (
        <Icon
            style={{
                ...tailwind("w-8 h-8"),
                ...{ tintColor: props.style.tintColor },
            }}
            name="plus"
        />
    );
    const LogoutIcon = (props: any) => (
        <Icon
            style={{
                ...tailwind("w-8 h-8"),
                ...{ tintColor: props.style.tintColor },
            }}
            name="person-delete-outline"
        />
    );

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("p-4 pb-3 bg-gray-100")}>
                <Layout
                    style={tailwind("flex-row justify-between pt-2 bg-transparent items-center")}>
                    <Text style={tailwind("text-4xl font-bold bg-transparent")}>Sticker Packs</Text>
                    <Layout style={tailwind("flex-row items-center pr-2 bg-transparent")}>
                        <Button
                            appearance="ghost"
                            style={tailwind("px-1")}
                            onPress={() =>
                                addStickerPackMutation.mutate({
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
                </Layout>
                <Input placeholder="Search" />
            </Layout>
            <Layout style={tailwind("flex-1")}>
                <List
                    style={styles.list}
                    data={myStickerPacksQuery.data}
                    renderItem={StickerPackComponent}
                    refreshing={
                        myStickerPacksQuery.isLoading ||
                        addStickerPackMutation.isLoading ||
                        deleteStickerPackMutation.isLoading
                    }
                    onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}
                />
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
    },
    stickerPackActionButton: {
        marginHorizontal: 6,
    },
    list: {
        width: "100%",
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    spinner: {
        alignSelf: "center",
        margin: 16,
    },
    stickerLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    stickerImage: {
        width: "21%",
        paddingBottom: "21%",
        marginHorizontal: "2%",
        marginBottom: "2%",
        borderRadius: 3,
    },
});
