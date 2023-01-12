import { Button, Icon, Layout, ModalService, Spinner, Text } from "@ui-kitten/components";
import { Alert, Platform, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import React, { useEffect } from "react";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import { STICKER_FULL_SIZE_PX } from "../../../../constants/StickerSizes";
import { generateName } from "../../../../util/placeholder_generation";
import { useQueryClient } from "react-query";
import { useStickerPack } from "../../../../api/hooks/query/stickerPack";
import { useRemoveStickerPackMutation, useUploadStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
import { NativeModules } from "react-native";
import {
    DEFAULT_TRAY_ICON,
    PLAYSTORE_URL,
    PUBLISHER_EMAIL,
    PUBLISHER_LICENSE,
    PUBLISHER_NAME,
    PUBLISHER_PRIVACY_POLICY,
    PUBLISHER_WEBSITE,
    STICKER_FILE_EXTENSION,
} from "../../../../constants/StickerInfo";
import StickerPackHeader from "../../../../components/stickerpack/StickerPackHeader";
import StickerPackBody from "../../../../components/stickerpack/StickerPackStickersBody";
import StickerPackActions from "./StickerPackActions";
import { StickerRo } from "../../../../api/generated-typescript-api-client/src";

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;

type Props = StackScreenProps<HomeStackParamList, "StickerPackDetailScreen">;
export const StickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data } = useStickerPack(route.params.stickerPack.id);

    const { mutate: uploadSticker } = useUploadStickerMutation(queryClient);
    const { mutate: deleteStickerPack } = useRemoveStickerPackMutation(queryClient);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Stickers",
            headerTitleAlign: "center",
            headerRight: HeaderRight,
        });
    }, [data]);

    const onStickerPress = (data: StickerRo): void => {
        navigation.navigate("StickerScreen", { sticker: data });
    };

    const onHeaderPress = () => {
        if (data == undefined) return;

        navigation.navigate("StickerPackManageScreen", {
            stickerPack: data,
        });
    };


    const pickAndUploadSticker = async (stickerPackId: string) => {
        ImagePicker.openPicker({
            width: STICKER_FULL_SIZE_PX,
            height: STICKER_FULL_SIZE_PX,
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

                const dto = { stickerPackId, stickerName, file };

                uploadSticker(dto);
            })
            .catch((error) => {
                if (error.code !== "E_PICKER_CANCELLED") {
                    console.log(error);
                }
            });
    };

    const onPressUpload = async () => {
        if (data == undefined) {
            return;
        }

        pickAndUploadSticker(data.id);
    };

    const AddIcon = (props: any) => (
        <Icon style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })} name="plus" />
    );
    const HeaderRight = () => (
        <Layout style={tw`flex-row mr-4`}>
            <Button
                disabled={data == undefined}
                appearance="ghost"
                style={tailwind("px-1")}
                onPress={onPressUpload}
                accessoryLeft={AddIcon}
            />
        </Layout>
    );

    const onAddToWhatsapp = async () => {
        const stickerMap: { [id: string]: string } = {};
        for (const sticker of data?.stickers || []) {
            stickerMap[sticker.id + STICKER_FILE_EXTENSION] = "🦘";
        }

        // TODO: add empty stickers in order to reach > 2 stickers?
        if (!data || data.stickers.length < 3) {
            Alert.alert("Invalid stickerpack", "Sticker packs require 3 stickers to be added to WhatsApp.");
            return;
        }

        // TODO: Can most likely directly call `addStickerPackToWhatsApp`.
        // As the ContentProvider should have propagated any updates through the effect in `HomeScreen`.
        if (Platform.OS == "android") {
            WhatsAppStickersModule.registerStickerPackAndAddToWhatsApp(
                data.id,
                data.name,
                PUBLISHER_NAME,
                DEFAULT_TRAY_ICON,
                PUBLISHER_EMAIL,
                PUBLISHER_WEBSITE,
                PUBLISHER_PRIVACY_POLICY,
                PUBLISHER_LICENSE,
                PLAYSTORE_URL,
                data.updatedAt,
                true,
                data.animated,
                stickerMap,
            );
        } else {
            console.log("iOS `addToWhatsApp` functionality not yet implemented");
            console.log("Paul, doe je best :)");
        }

        // TODO: Verify that stickerpack has been added successfully.
        // See: https://github.com/WhatsApp/stickers/tree/master/Android#check-if-pack-is-added-optional
    };

    const onPressDeleteStickerPack = async () => {
        if (!data) return;

        let modalId = ''

        const hideModal = () => ModalService.hide(modalId);

        const confirmDelete = async () => {
            console.log("Delete stickerpack")
            await deleteStickerPack(data.id);
            hideModal();
            navigation.pop();
        }

        modalId = ModalService.show(
            <TouchableOpacity
                style={tailwind("w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50")}
                onPress={hideModal}
            >
                <Layout style={tailwind("flex bg-white p-6 rounded-2xl w-3/4")}>
                    <Text style={tailwind("font-bold")}>Are you sure?</Text>
                    <Layout style={tailwind("flex flex-col justify-around mt-6")}>
                        <Button onPress={confirmDelete} status="danger">Delete Stickerpack</Button>
                        <Button onPress={hideModal} status="basic" appearance="ghost" size="small">Cancel</Button>
                    </Layout>
                </Layout>
            </TouchableOpacity>,
            {
                onBackdropPress: hideModal,
            }
        );
    }

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            {data == undefined ? (
                <Layout style={tw`flex-1 items-center mt-20`}>
                    <Spinner size="giant" />
                </Layout>
            ) : (
                <>
                    <StickerPackHeader stickerPack={data} onHeaderPress={onHeaderPress} />
                    <StickerPackBody stickerPack={data} onStickerPress={onStickerPress} />
                    <StickerPackActions
                        onPressAddToWhatsapp={onAddToWhatsapp}
                        onPressInviteFriends={() => console.log("invite friends")}
                        onPressUploadSticker={onPressUpload}
                        onPressDeleteStickerPack={onPressDeleteStickerPack}
                    />
                </>
            )}
        </SafeAreaView>
    );
};
