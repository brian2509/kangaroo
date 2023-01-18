import React, { useEffect, useState } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon } from "@ui-kitten/components";
import { Image, SafeAreaView, ToastAndroid } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tw from "tailwind-react-native-classnames";
import tailwind from "tailwind-rn";
import { useDeleteStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
import { useQueryClient } from "react-query";
import { ConfirmModal } from "../../../../components/common/ConfirmModal";


type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
const StickerScreen = ({ route, navigation }: Props): JSX.Element => {
    const { stickerPack, sticker, allowDeleteSticker } = route.params;

    const [confirmModalVisible, setConfirmModalVisible] = useState(false)

    const queryClient = useQueryClient();
    const { mutate: deleteSticker } = useDeleteStickerMutation(queryClient);

    const onPressConfirmDelete = async () => {
        deleteSticker({
            stickerPackId: stickerPack.id,
            stickerId: sticker.id,
        }, {
            onSuccess: () => {
                navigation.pop();
            },
            onError: () => {
                ToastAndroid.show("Something went wrong while deleting the sticker, please try again.", 10000);
            }
        })
    }

    const onPressDeleteButton = async () => {
        setConfirmModalVisible(true);
    }

    const DeleteIcon = () => (
        <Button
            appearance="ghost"
            status="danger"
            style={tailwind("mx-3 px-1")}
            onPress={onPressDeleteButton}
            accessoryLeft={(props) => (<Icon style={tw.style("w-8 h-8")} name="trash" {...props} />)}
        />
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: allowDeleteSticker ? DeleteIcon : undefined,
        });
    }, [])

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <Image
                style={tw.style("rounded-lg w-full", { paddingBottom: "100%" })}
                source={{ uri: sticker.fileUrl }}
            />
            <ConfirmModal
                visible={confirmModalVisible}
                hideModal={() => setConfirmModalVisible(false)}
                message="Are you sure?"
                buttonText="Delete Sticker"
                onPressConfirm={onPressConfirmDelete}
                status="danger"
            />
        </SafeAreaView>
    );
}

export default StickerScreen;
