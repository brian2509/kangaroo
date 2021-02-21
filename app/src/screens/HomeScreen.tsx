import React, { useEffect, useState } from "react";
import {
    Divider,
    Layout,
    List,
    ListItem,
    Text,
    Button,
    Spinner,
    Icon,
} from "@ui-kitten/components";
import { Image, Platform, SafeAreaView, StyleSheet } from "react-native";
import axios from "../api/axios";
import DocumentPicker from "react-native-document-picker";

interface Props {}

interface Sticker {
    id: string;
    name: string;
    url: string;
}

interface StickerPack {
    id: string;
    name: string;
    private: boolean;
    stickers: Sticker[];
}

const generateName = (): string => {
    return Date.now().toString();
};

export const HomeScreen = (props: Props) => {
    const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getStickerPacks();
    }, []); // [] means it only execute once at the start

    const getStickerPacks = async () => {
        setLoading(true);

        axios
            .get("sticker-packs")
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
                console.log(err);
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
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const uploadSticker = async (id: string) => {
        // TODO: fix file reading, image.uri is "content://..." but should be something like "file://..."
        return;

        setLoading(true);

        try {
            const image = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            var formData = new FormData();

            const stickerName = generateName();

            formData.append("name", stickerName);
            formData.append("file", {
                uri: Platform.OS === "android" ? image.uri : "file://" + image.uri,
                name: `${stickerName}.jpg`,
                type: "image/*",
            });

            console.log({ formData });

            axios
                .post(`sticker-packs/${id}/stickers`, formData, {
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

    const deleteSticker = async (id: string) => {
        setLoading(true);

        axios
            .delete(`sticker-packs/${id}`)
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
                    onPress={() => deleteSticker(stickerPack.id)}
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
                <Layout style={styles.buttonContainer}>
                    <Button style={styles.button} appearance="outline" onPress={getStickerPacks}>
                        Fetch Sticker Packs
                    </Button>
                    <Button style={styles.button} appearance="outline" onPress={addStickerPack}>
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
