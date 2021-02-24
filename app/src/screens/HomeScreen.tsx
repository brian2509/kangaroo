import React, { useEffect, useState } from "react";
import { Divider, Layout, List, ListItem, Text, Button, Icon } from "@ui-kitten/components";
import { Image, Platform, SafeAreaView, StyleSheet } from "react-native";
import axios from "../api/axios";
import DocumentPicker from "react-native-document-picker";
import { AccessTokenContext } from "../contexts/AccessTokenContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import { StickerPack } from "../common/StickerPack"

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

const generateName = (): string => {
    return Date.now().toString();
};

export const HomeScreen = ({ navigation }: Props) => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getStickerPacks();
    }, []);

    const logout = async () => {
        setAccessToken(undefined);
    };

    const getStickerPacks = async () => {
        setLoading(true);

        axios
            .get("me/sticker-packs")
            .then((res: any) => {
                const stickerResults: StickerPack[] = res.data.map((entry: any) => {
                    return {
                        id: entry.id,
                        name: entry.name,
                        private: entry.private,
                        stickers: entry.stickers.map((stickerEntry: any) => {
                            return {
                                id: stickerEntry.id,
                                name: stickerEntry.name,
                                url: stickerEntry.url,
                            };
                        }),
                    };
                });
                setStickerPacks(stickerResults);
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    // Unauthorized
                    setStickerPacks([]);
                } else {
                    console.log("Error", { response: err.response });
                }
            })
            .then(() => {
                setLoading(false);
            });
    };

    const addStickerPack = async () => {
        setLoading(true);

        const body = { name: generateName(), private: true };

        axios
            .post("sticker-packs", body)
            .then(getStickerPacks)
            .catch((err) => {
                console.log("Error", { response: err.response });
            })
            .then(() => {
                setLoading(false);
            });
    };

    const uploadSticker = async (stickerPackId: string) => {
        // TODO: fix file reading, image.uri is "content://..." but should be something like "file://..."
        return;

        setLoading(true);

        try {
            const image = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            const formData = new FormData();

            const stickerName = generateName();

            formData.append("name", stickerName);
            formData.append("file", {
                uri: Platform.OS === "android" ? image.uri : "file://" + image.uri,
                name: `${stickerName}.jpg`,
                type: "image/*",
            });

            console.log({ formData });

            axios
                .post(`sticker-packs/${stickerPackId}/stickers`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(getStickerPacks)
                .catch((err) => {
                    console.log(err);
                })
                .then(() => {
                    setLoading(false);
                });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                setLoading(false);
            } else {
                console.log(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteStickerPack = async (stickerPackId: string) => {
        setLoading(true);

        axios
            .delete(`sticker-packs/${stickerPackId}`)
            .then(getStickerPacks)
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });
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
                    onPress={() => uploadSticker(stickerPack.id)}
                    accessoryLeft={UploadIcon}
                />
                <Button
                    style={styles.stickerPackActionButton}
                    status="danger"
                    appearance="outline"
                    onPress={() => deleteStickerPack(stickerPack.id)}
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
                    onPress={() => {
                        navigation.navigate('StickerDetailScreen', {
                            'stickerPack': item
                        })
                    }}
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
                    <Button style={styles.button} onPress={getStickerPacks}>
                        Fetch Sticker Packs
                    </Button>
                    <Button style={styles.button} onPress={addStickerPack}>
                        Add Sticker Pack
                    </Button>
                </Layout>
                <List
                    style={styles.list}
                    data={stickerPacks}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                    refreshing={loading}
                    onRefresh={getStickerPacks}
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
