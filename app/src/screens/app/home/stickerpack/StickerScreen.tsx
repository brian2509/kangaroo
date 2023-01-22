import React, { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon, Layout } from "@ui-kitten/components";
import { Image, SafeAreaView } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tw from "tailwind-react-native-classnames";
import tailwind from "tailwind-rn";
import { useDeleteStickerMutation, useSetTrayIconMutation } from "../../../../api/hooks/mutations/stickerPack";
import { useQueryClient } from "react-query";
import { showConfirmModal } from "../../../../components/common/ConfirmModal";


type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
const StickerScreen = ({ route, navigation }: Props): JSX.Element => {
    const { stickerPack, sticker, allowDeleteSticker, allowSetAsTrayIcon } = route.params;

    const queryClient = useQueryClient();
    const { mutate: deleteSticker } = useDeleteStickerMutation(queryClient);
    const { mutate: setTrayIcon } = useSetTrayIconMutation(queryClient);

    const onPressDeleteSticker = async () => {
        const onPressConfirm = async () => {
            await deleteSticker({
                stickerPackId: stickerPack.id,
                stickerId: sticker.id,
            })
            navigation.pop();
        }

        showConfirmModal({
            message: "Are you sure?",
            buttonText: "Delete Sticker",
            onPressConfirm,
            status: "danger"
        });
    }

    const onPressSetAsTrayIcon = async () => {
        const onPressConfirm = async () => {
            await setTrayIcon({
                stickerPackId: stickerPack.id,
                stickerId: sticker.id,
            })
            navigation.pop();
        }

        showConfirmModal({
            message: "Are you sure?",
            buttonText: "Set as tray icon",
            onPressConfirm,
        });
    }

    const DeleteIcon = () => (
        <Button
            appearance="ghost"
            status="danger"
            style={tailwind("px-1")}
            onPress={onPressDeleteSticker}
            accessoryLeft={(props) => (<Icon style={tw.style("w-8 h-8")} name="trash" {...props} />)}
        />
    );

    const SetTrayIconButton = () => (
        <Button
            appearance="ghost"
            // status="danger"
            style={tailwind("px-1")}
            onPress={onPressSetAsTrayIcon}
            accessoryLeft={(props) => (<Icon style={tw.style("w-8 h-8")} name="image" {...props} />)}
        />
    )

    const StickerActions = () => (
        <Layout style={tailwind("flex flex-row mr-3")}>
            {allowDeleteSticker ? <DeleteIcon /> : null}
            {allowSetAsTrayIcon ? <SetTrayIconButton /> : null}
        </Layout>
    )

    useEffect(() => {
        navigation.setOptions({
            headerRight: StickerActions,
        });
    }, [])

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <Image
                style={tw.style("rounded-lg w-full", {
                    paddingBottom: "100%",
                })}
                source={{ uri: sticker.fileUrl }}
            />
        </SafeAreaView>
    );
}

export default StickerScreen;
