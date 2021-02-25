import React, { useEffect, useState } from "react";
import { Divider, Layout, List, ListItem, Text, Button, Icon } from "@ui-kitten/components";
import { Image, Platform, SafeAreaView, StyleSheet } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { AccessTokenContext } from "../contexts/AccessTokenContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import * as stickerPackApi from "../api/stickerPacksApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { StickerPack } from "../api/apiTypes";
import { QUERY_KEYS } from "../constants/reactQueryKeys";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

const generateName = (): string => {
    return Date.now().toString();
};

const logErrorResponse = (e: any) => {
    console.log("Logging error response");

    if (e.response) {
        console.log("Error:", { response: e.response });
    } else {
        console.log(e);
    }
};

export const HomeScreen = ({ navigation }: Props) => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
    }, [accessToken]);

    const logout = async () => {
        setAccessToken(undefined);
    };

    const myStickerPacksQuery = useQuery(
        QUERY_KEYS.myStickerPacks,
        stickerPackApi.fetchMyStickerPacks,
        {
            onError: logErrorResponse,
        },
    );

    const addStickerPackMutation = useMutation(stickerPackApi.addStickerPack, {
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

    const deleteStickerPackMutation = useMutation(stickerPackApi.deleteStickerPack, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

    const uploadStickerMutation = useMutation(stickerPackApi.uploadSticker, {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
        onError: logErrorResponse,
    });

    const pickAndUploadSticker = async (stickerPackId: string) => {
        // TODO: fix file reading, on Android image.uri is "content://..." but should be something like "file://..."
        return;

        try {
            const stickerName = generateName();

            const image = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            const formData = new FormData();
            formData.append("name", stickerName);
            const fileData = {
                uri: Platform.OS === "android" ? image.uri : "file://" + image.uri,
                name: `${stickerName}.jpg`,
                type: "image/*",
            };

            formData.append("file", fileData);

            uploadStickerMutation.mutate({ stickerPackId, formData });
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                logErrorResponse(err);
            }
        }
    };

    const renderItemAccessory = (stickerPack: StickerPack) => {
        const UploadIcon = (props: any) => <Icon {...props} name="upload" />;
        const TrashIcon = (props: any) => <Icon {...props} name="trash" />;

        return (
            <>
                <Button
                    style={styles.stickerPackActionButton}
                    status="success"
                    appearance="outline"
                    onPress={() => pickAndUploadSticker(stickerPack.id)}
                    accessoryLeft={UploadIcon}
                />
                <Button
                    style={styles.stickerPackActionButton}
                    status="danger"
                    appearance="outline"
                    onPress={() => deleteStickerPackMutation.mutate({ id: stickerPack.id })}
                    accessoryLeft={TrashIcon}
                />
            </>
        );
    };

    const renderItem = ({ item }: { item: StickerPack }) => {
        const title = `${item.name}`;
        const description = `${item.stickers.length} sticker${
            item.stickers.length != 1 ? "s" : ""
        } ${item.private ? "\nPrivate" : ""}`;

        return (
            <Layout>
                <ListItem
                    title={title}
                    description={description}
                    accessoryRight={() => renderItemAccessory(item)}
                />
                <Layout style={styles.stickerLayout}>
                    {item.stickers.map((sticker) => {
                        return (
                            <Image
                                style={styles.stickerImage}
                                key={sticker.id}
                                source={{
                                    uri: sticker.url,
                                    headers: {
                                        Authorization: "Bearer " + accessToken,
                                    },
                                }}
                            />
                        );
                    })}
                </Layout>
            </Layout>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Text style={styles.text} category="h1">
                    Welcome! 🦒
                </Text>
                <Button
                    style={styles.button}
                    appearance="outline"
                    status="danger"
                    size="small"
                    onPress={logout}>
                    Logout
                </Button>
                <Layout style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        onPress={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}>
                        Fetch Sticker Packs
                    </Button>
                    <Button
                        style={styles.button}
                        onPress={() =>
                            addStickerPackMutation.mutate({
                                name: generateName(),
                                private: true,
                            })
                        }>
                        Add Sticker Pack
                    </Button>
                </Layout>
                <List
                    style={styles.list}
                    data={myStickerPacksQuery.data}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
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
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 16,
    },
    text: {
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
    },
    button: {
        margin: 16,
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
