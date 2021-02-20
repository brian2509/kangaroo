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
import { SafeAreaView, StyleSheet } from "react-native";
import { TopNavigationBar } from "../common/TopNavigationBar";
import axios from "../api/axios";

interface Props {}

interface Sticker {
    id: string;
    name: string;
}

const generateName = (): string => {
    return Date.now().toString();
};

export const HomeScreen = (props: Props) => {
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getStickers();
    }, []); // [] means it only execute once at the start

    const getStickers = async () => {
        setLoading(true);

        axios
            .get("stickers")
            .then((res: any) => {
                const stickerResults: Sticker[] = res.data.map((entry: any) => {
                    return {
                        id: entry.id,
                        name: entry.name,
                    };
                });
                setStickers(stickerResults);
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const addSticker = async () => {
        setLoading(true);

        axios
            .post("stickers", { name: generateName() })
            .then(getStickers)
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const deleteSticker = async (id: string) => {
        setLoading(true);

        axios
            .delete(`stickers/${id}`)
            .then(getStickers)
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const TrashIcon = (props: any) => <Icon {...props} name="trash" />;

    const renderItemAccessory = (sticker: Sticker) => {
        return (
            <Button
                status="danger"
                appearance="outline"
                onPress={() => deleteSticker(sticker.id)}
                accessoryLeft={TrashIcon}
            />
        );
    };

    const renderItem = ({ item }: { item: Sticker }) => (
        <ListItem
            title={`${item.name}`}
            description={`${item.id}`}
            accessoryRight={() => renderItemAccessory(item)}
        />
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationBar />
            <Layout style={styles.container}>
                <Text style={styles.text} category="h1">
                    Welcome! 🦒
                </Text>
                <Layout style={styles.buttonContainer}>
                    <Button style={styles.button} appearance="outline" onPress={getStickers}>
                        Fetch Stickers
                    </Button>
                    <Button style={styles.button} appearance="outline" onPress={addSticker}>
                        Add Sticker
                    </Button>
                </Layout>
                {stickers.length > 0 ? (
                    <Layout style={styles.listContainer}>
                        <List
                            data={stickers}
                            ItemSeparatorComponent={Divider}
                            renderItem={renderItem}
                        />
                    </Layout>
                ) : (
                    <Text style={styles.text} appearance="hint">
                        No Stickers
                    </Text>
                )}
                {loading && <Spinner size="giant" />}
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 16,
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
    listContainer: {
        width: "100%",
        flexDirection: "row",
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});
