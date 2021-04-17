import { Button, Icon, Layout, Spinner, Text } from "@ui-kitten/components";
import { Image, Platform, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import React, { useEffect, useState } from "react";
import { StickerPackRo, StickerRo } from "../../../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../../../../components/common/CoverStickerImage";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import { STICKER_FULL_SIZE_PX } from "../../../../constants/StickerSizes";
import { generateName } from "../../../../util/placeholder_generation";
import { useQueryClient } from "react-query";
import { useStickerPack } from "../../../../api/hooks/query/stickerPack";
import { PlaceholderImage } from "../../../../components/common/PlaceholderImage";
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
import { useCreateInviteMutation } from "../../../../api/hooks/mutations/invites";
import { MAX_STICKERS_PER_PACK } from "../../../../constants/StickerPack";
import { createInviteUrl } from "../../../../util/invites";
import { PackStickersView } from "../../../../components/stickerpack/PackStickersView";

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;

type StickerPackProps = {
    stickerPack: StickerPackRo;
    onStickerPress?: (sticker: StickerRo) => void;
};
interface BodyProps extends StickerPackProps {
    onCreateAndShareInvite: () => Promise<void>;
}

const Body = ({ stickerPack, onStickerPress, onCreateAndShareInvite }: BodyProps) => {
    return (
        <ScrollView style={tailwind("p-4 pt-3")}>
            <Layout style={tailwind("flex-row items-end items-baseline")}>
                <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                    {stickerPack.stickers.length}/{MAX_STICKERS_PER_PACK}
                </Text>
            </Layout>
            <PackStickersView stickerPack={stickerPack} onStickerPress={onStickerPress} />
            <Button style={tailwind("my-8")} onPress={onCreateAndShareInvite}>
                Share invite!
            </Button>
        </ScrollView>
    );
};

const ToolBar = ({ stickerPack }: StickerPackProps) => {
    return (
        <Layout style={tailwind("flex-col p-4 pt-2 pb-2 border-b-2 border-t border-gray-300")}>
            <Layout style={tailwind("flex-row justify-between w-1/3 pb-1")}>
                <Icon name="heart-outline" fill="gray" width={25} height={25} />
                <Icon name="paper-plane-outline" fill="gray" width={25} height={25} />
                <Icon name="upload" fill="gray" width={25} height={25} />
            </Layout>
            <Layout style={tailwind("flex-row pt-1")}>
                <Text style={tw`text-xs font-semibold`}>{`${stickerPack.views} Views`}</Text>
                <Text style={tw`text-xs pl-3 font-semibold`}>{`${stickerPack.likes} Likes`}</Text>
                <Text
                    style={tw`text-xs pl-3 font-semibold`}>{`${stickerPack.likes} Followers`}</Text>
            </Layout>
        </Layout>
    );
};

type Props = StackScreenProps<HomeStackParamList, "StickerPackDetailScreen">;
export const StickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data: stickerPack } = useStickerPack(route.params.stickerPackId);

    const uploadStickerMutation = useUploadStickerMutation(queryClient);

    const createInviteMutation = useCreateInviteMutation(route.params.stickerPackId);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: HeaderTitle,
            headerTitleAlign: "left",
            headerRight: HeaderRight,
        });
    }, [stickerPack]);

    const onStickerPress = (sticker: StickerRo): void => {
        navigation.navigate("StickerScreen", { sticker });
    };

    const onHeaderPress = () => {
        if (stickerPack == undefined) {
            return;
        }

        navigation.navigate("StickerPackManageScreen", {
            stickerPack,
        });
    };

    const HeaderTitle = () => (
        <Layout style={tw`flex-row left-0`}>
            {stickerPack == undefined ? (
                <PlaceholderImage style={tw.style("w-9 h-9 mr-3 rounded-full")} />
            ) : (
                <>
                    <CoverStickerImage
                        stickerPack={stickerPack}
                        style={tw.style("w-9 h-9 mr-3 rounded-full")}
                        onStickerPress={onStickerPress}
                    />
                    <TouchableOpacity onPress={onHeaderPress}>
                        <Layout style={tw`flex-col`}>
                            <Text>{stickerPack.name}</Text>
                            <Text style={tw`text-gray-500 text-xs`}>
                                Willem, Brian, Mika, Rowdy
                            </Text>
                        </Layout>
                    </TouchableOpacity>
                </>
            )}
        </Layout>
    );

    const AddIcon = (props: any) => (
        <Icon style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })} name="plus" />
    );

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

                uploadStickerMutation.mutate(dto);
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
        if (!stickerPack) {
            // TODO: Error feedback to user.
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
                    <Button status={"success"} onPress={onAddToWhatsapp}>
                        Add to WhatsApp!
                    </Button>
                    <Body
                        stickerPack={stickerPack}
                        onStickerPress={onStickerPress}
                        onCreateAndShareInvite={onCreateAndShareInvite}
                    />
                    <ToolBar stickerPack={stickerPack} />
                </>
            )}
        </SafeAreaView>
    );
};
