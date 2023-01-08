import { Button, Icon, Layout, Spinner, Text } from "@ui-kitten/components";
import { Alert, Image, Platform, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import React, { useEffect } from "react";
import { StickerPackRo, StickerRo } from "../../../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../../../../components/common/CoverStickerImage";
import ImagePicker, { Image as ImageData } from "react-native-image-crop-picker";
import { STICKER_FULL_SIZE_PX } from "../../../../constants/StickerSizes";
import { generateName } from "../../../../util/placeholder_generation";
import { useQueryClient } from "react-query";
import { useStickerPack } from "../../../../api/hooks/query/stickerPack";
import { PlaceholderImage } from "../../../../components/common/PlaceholderImage";
import { useUploadStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
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
import { fullMemberList } from "../../../../util/stickerpack_utils";
import { FloatingAction } from "react-native-floating-action";
import StickerPackHeader from "../../../../components/stickerpack/StickerPackHeader";
import StickerPackBody from "../../../../components/stickerpack/StickerPackStickersBody";

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;

type Props = StackScreenProps<HomeStackParamList, "StickerPackDetailScreen">;
export const StickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data } = useStickerPack(route.params.stickerPack.id);

    const uploadStickerMutation = useUploadStickerMutation(queryClient);

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

    const HeaderTitle = () => (
        <Layout style={tw`flex-row left-0`}>
            {data == undefined ? (
                <PlaceholderImage style={tw.style("w-9 h-9 mr-3 rounded-full")} />
            ) : (
                <>
                    <CoverStickerImage
                        stickerPack={data}
                        style={tw.style("w-9 h-9 mr-3 rounded-full")}
                        onStickerPress={onStickerPress}
                    />
                    <TouchableOpacity style={tw`w-full`} onPress={onHeaderPress}>
                        <Layout style={tw`flex-col`}>
                            <Text>{data.name}</Text>
                            <Text style={tw`text-gray-500 text-xs`} numberOfLines={1}>
                                {fullMemberList(data)
                                    .map((member) => member.username)
                                    .join(", ")}
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
        if (data == undefined) {
            return;
        }

        pickAndUploadSticker(data.id);
    };

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
                    <FloatingAction
                        actions={[{
                            text: "Add Sticker",
                            name: "add_sticker",
                            icon: require("../../../../assets/icons/plus.jpg"),
                        }, {
                            text: "Share Sticker Pack",
                            name: "share_sticker_pack",
                            icon: require("../../../../assets/icons/share.png"),
                        }, {
                            text: "Add to WhatsApp",
                            name: "add_to_whatsapp",
                            icon: require("../../../../assets/icons/whatsapp.png"),
                        }]}
                        onPressItem={(name) => {
                            if (name === "add_sticker") {
                                onPressUpload();
                            } else if (name === "share_sticker_pack") {
                                console.log("Share sticker pack")
                            } else if (name === "add_to_whatsapp") {
                                onAddToWhatsapp();
                            }
                        }}
                    />
                </>
            )}
        </SafeAreaView>
    );
};
