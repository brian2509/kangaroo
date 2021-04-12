import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, SafeAreaView } from "react-native";
import { useQueryClient } from "react-query";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { useDeleteStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
import { DeleteStickerButton } from "../../../../components/stickerscreen/DeleteStickerButton";
import { DeleteStickerModal } from "../../../../components/stickerscreen/DeleteStickerModal";

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
            if (!stickerPack) {
                return <></>;
            }

            return (
                <DeleteStickerButton
                    stickerPack={stickerPack}
                    onPress={() => setModalVisible(true)}
                />
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
            <DeleteStickerModal
                modalVisible={modalVisible}
                hideModal={() => setModalVisible(false)}
                isDeleting={isLoading}
                onDeleteSticker={onDeleteSticker}
            />
        </SafeAreaView>
    );
};
