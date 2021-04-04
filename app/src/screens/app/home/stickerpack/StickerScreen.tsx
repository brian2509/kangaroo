import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon, Layout, Modal, Spinner } from "@ui-kitten/components";
import React, { useState } from "react";
import { Image, SafeAreaView, Text } from "react-native";
import { useQueryClient } from "react-query";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { useDeleteStickerMutation } from "../../../../api/hooks/mutations/stickerPack";

type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
export const StickerScreen = ({ navigation, route }: Props) => {
    const { sticker, stickerPack } = route.params;

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const { mutate: deleteSticker, isLoading } = useDeleteStickerMutation(queryClient);

    const onDeleteSticker = () => {
        if (stickerPack == undefined) {
            return;
        }

        const deleteInfo = {
            stickerPackId: stickerPack.id,
            stickerId: sticker.id,
        };

        deleteSticker(deleteInfo, {
            onSuccess: () => {
                setModalVisible(false);
                navigation.pop();
            },
        });
    };

    navigation.setOptions({
        headerTitle: "Sticker",
        headerRight: function headerRight() {
            return (
                <Layout style={tw`flex-row mr-4`}>
                    {stickerPack && (
                        <Button
                            status="danger"
                            appearance="ghost"
                            onPress={() => setModalVisible(true)}
                            accessoryLeft={(props: any) => (
                                <Icon
                                    name="trash-2-outline"
                                    style={tw.style("w-6 h-6", {
                                        tintColor: props.style.tintColor,
                                    })}
                                />
                            )}
                        />
                    )}
                </Layout>
            );
        },
    });

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <Image
                style={tw.style("rounded-lg w-full", {
                    paddingBottom: "100%",
                })}
                source={{ uri: sticker.fileUrl }}
            />
            <Modal
                visible={modalVisible}
                style={tw`w-60`}
                backdropStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onBackdropPress={() => {
                    setModalVisible(false);
                }}>
                <Layout style={tw`rounded-2xl`}>
                    <Text style={tw`pt-4 pb-1 text-xs text-gray-500 text-center`}>
                        {isLoading ? "Deleting sticker..." : "Are you sure?"}
                    </Text>
                    <Layout style={tw`flex h-16 w-full rounded-2xl justify-center items-center`}>
                        {isLoading ? (
                            <Spinner size="giant" />
                        ) : (
                            <Button
                                status="danger"
                                size="large"
                                appearance="ghost"
                                style={tw`w-full h-full`}
                                onPress={onDeleteSticker}>
                                Delete
                            </Button>
                        )}
                    </Layout>
                </Layout>
            </Modal>
        </SafeAreaView>
    );
};
