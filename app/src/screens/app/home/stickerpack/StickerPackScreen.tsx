import React, { useEffect } from "react";
import { Alert, Platform, SafeAreaView, TouchableOpacity } from "react-native";

import { Button, Icon, Layout, ModalService, Spinner, Text } from "@ui-kitten/components";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import { STICKER_FULL_SIZE_PX } from "../../../../constants/StickerSizes";
import { generateName } from "../../../../util/placeholder_generation";
import { useQueryClient } from "react-query";
import { useStickerPack } from "../../../../api/hooks/query/stickerPack";
import { useUploadStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
import Clipboard from "@react-native-clipboard/clipboard";
import { showToast } from "../../../../util/ui";
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
import { useCreateInviteMutation } from "../../../../api/hooks/mutations/invites";
import { StickerRo } from "../../../../api/generated-typescript-api-client/src";
import { createInviteUrl } from "../../../../util/invites";

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;


// Temporary upload caching for testing, set to false to disable using a cached image for all uploads
// Remove after Network Error issue is fixed
export const USE_SAME_CACHED_IMAGE = false;
export let singleCachedFile: undefined | {
    uri: string;
    name: string;
    type: string;
};


type Props = StackScreenProps<HomeStackParamList, "StickerPackScreen">;
export const StickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data: stickerPack, isFetching, refetch } = useStickerPack(route.params.stickerPack.id);

    const { mutate: uploadSticker } = useUploadStickerMutation(queryClient);

    const createInviteMutation = useCreateInviteMutation(route.params.stickerPack.id);

    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRight,
        });
    }, [stickerPack]);

    const onStickerPress = (sticker: StickerRo): void => {
        if (!stickerPack) return;

        navigation.navigate("StickerScreen", {
            sticker,
            stickerPack,
            allowDeleteSticker: true
        });
    };

    const onHeaderPress = () => {
        if (stickerPack == undefined) return;

        navigation.navigate("StickerPackManageScreen", {
            stickerPackId: stickerPack.id,
        });
    };


    const pickAndUploadSticker = async (stickerPackId: string) => {
        console.log(singleCachedFile);

        // Temporary testing method of caching and reusing the same sticker
        // Remove after Network Error issue is fixed
        if (USE_SAME_CACHED_IMAGE && singleCachedFile) {
            console.log("Using and uploading cached sticker");

            const stickerName = generateName();
            const dto = { stickerPackId, stickerName, file: singleCachedFile };

            uploadSticker(dto);
            return;
        } else {
            singleCachedFile = undefined;
        }

        ImagePicker.openPicker({
            width: STICKER_FULL_SIZE_PX,
            height: STICKER_FULL_SIZE_PX,
            cropping: true,
            mediaType: "photo",
        })
            .then((image: ImageData) => {
                const stickerName = generateName();

                console.log("Picked image...", stickerName);

                const file = {
                    uri: image.path,
                    name: image.path.split("/").slice(-1)[0],
                    type: image.mime,
                };

                if (USE_SAME_CACHED_IMAGE) {
                    singleCachedFile = file;
                }

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
        if (stickerPack == undefined) {
            return;
        }

        pickAndUploadSticker(stickerPack.id);
    };

    const AddIcon = (props: any) => (
        <Icon style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })} name="plus" />
    );
    const HeaderRight = () => (
        <Layout style={tw`flex-row mr-4`}>
            <Button
                disabled={stickerPack == undefined}
                appearance="ghost"
                style={tailwind("px-1")}
                onPress={onPressUpload}
                accessoryLeft={AddIcon}
            />
        </Layout>
    );

    const onAddToWhatsapp = async () => {
        const stickerMap: { [id: string]: string } = {};
        for (const sticker of stickerPack?.stickers || []) {
            stickerMap[sticker.id + STICKER_FILE_EXTENSION] = "🦘";
        }

        // TODO: add empty stickers in order to reach > 2 stickers?
        if (!stickerPack || stickerPack.stickers.length < 3) {
            Alert.alert("Invalid stickerpack", "Sticker packs require 3 stickers to be added to WhatsApp.");
            return;
        }

        // TODO: Can most likely directly call `addStickerPackToWhatsApp`.
        // As the ContentProvider should have propagated any updates through the effect in `HomeScreen`.
        if (Platform.OS == "android") {
            WhatsAppStickersModule.registerStickerPackAndAddToWhatsApp(
                stickerPack.id,
                stickerPack.name,
                PUBLISHER_NAME,
                DEFAULT_TRAY_ICON,
                PUBLISHER_EMAIL,
                PUBLISHER_WEBSITE,
                PUBLISHER_PRIVACY_POLICY,
                PUBLISHER_LICENSE,
                PLAYSTORE_URL,
                stickerPack.updatedAt,
                true,
                stickerPack.animated,
                stickerMap,
            );
        } else {
            console.log("iOS `addToWhatsApp` functionality not yet implemented");
            console.log("Paul, doe je best :)");
        }

        // TODO: Verify that stickerpack has been added successfully.
        // See: https://github.com/WhatsApp/stickers/tree/master/Android#check-if-pack-is-added-optional
    };

    const onCreateAndShareInvite = async () => {
        createInviteMutation.mutate(
            {}, // TODO: Add expiry date
            {
                onSuccess: (data) => {
                    const inviteUrl = createInviteUrl(data);
                    Clipboard.setString(inviteUrl);
                    showToast("Share link copied to clipboard!");
                },
                onError: (err) => {
                    if (err?.response?.data?.statusCode == 403) {
                        showToast("Unauthorized! Only the owner can create an invite");
                    } else {
                        showToast("Failed to create invite link, please try again.");
                    }
                },
            },
        );
    };

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            {stickerPack == undefined ? (
                <Layout style={tw`flex-1 items-center mt-20`}>
                    <Spinner size="giant" />
                </Layout>
            ) : (
                <>
                    <StickerPackHeader stickerPack={stickerPack} onHeaderPress={onHeaderPress} />
                    <StickerPackBody
                        stickerPack={stickerPack}
                        onStickerPress={onStickerPress}
                        onRefresh={refetch}
                        refreshing={isFetching}
                    />
                    <StickerPackActions
                        onPressAddToWhatsapp={onAddToWhatsapp}
                        onPressInviteFriends={onCreateAndShareInvite}
                        onPressUploadSticker={onPressUpload}
                    />
                </>
            )}
        </SafeAreaView >
    );
};
