import { Button, Icon, Layout, Spinner, Text } from "@ui-kitten/components";
import { Alert, Image, Platform, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
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

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;

type StickerPackProps = {
    stickerPack: StickerPackRo;
    onStickerPress?: (sticker: StickerRo) => void;
};

class AuthorStickersView extends React.Component<StickerPackProps> {
    renderSticker = (sticker: StickerRo): JSX.Element => {
        return (
            <TouchableOpacity
                key={sticker.id}
                style={{
                    width: "21%",
                    height: "auto",
                    marginHorizontal: "2%",
                    marginBottom: "3.5%",
                }}
                onPress={() => {
                    if (this.props.onStickerPress) {
                        this.props.onStickerPress(sticker);
                    }
                }}>
                <Image
                    style={tw.style("rounded-lg", {
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 3,
                    })}
                    source={{
                        uri: sticker.fileUrl,
                    }}
                />
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <Layout style={tailwind("flex-col p-2 pt-1")}>
                <Layout style={tailwind("flex-row flex-grow justify-between items-baseline")}>
                    <Text style={tailwind("font-semibold mr-4")}>
                        Willem Alexander
                        <Text style={tailwind("text-xs text-gray-500")}>
                            {" "}
                            ({this.props.stickerPack.stickers.length})
                        </Text>
                    </Text>
                    <Text style={tailwind("text-gray-500 pt-3 text-xs")}>Wed 4:20</Text>
                </Layout>
                <Layout style={tw`flex-row flex-wrap pt-3`}>
                    {this.props.stickerPack.stickers.map((sticker) => {
                        return this.renderSticker(sticker);
                    })}
                </Layout>
            </Layout>
        );
    }
}

class Body extends React.Component<StickerPackProps> {
    render() {
        return (
            <ScrollView style={tailwind("p-4 pt-3")}>
                <Layout style={tailwind("flex-row items-end items-baseline")}>
                    <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                    <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                        {this.props.stickerPack.stickers.length}/30
                    </Text>
                </Layout>
                <AuthorStickersView
                    stickerPack={this.props.stickerPack}
                    onStickerPress={this.props.onStickerPress}
                />
            </ScrollView>
        );
    }
}

class ToolBar extends React.Component<StickerPackProps> {
    render() {
        return (
            <Layout style={tailwind("flex-col p-4 pt-2 pb-2 border-b-2 border-t border-gray-300")}>
                <Layout style={tailwind("flex-row justify-between w-1/3 pb-1")}>
                    <Icon name="heart-outline" fill="gray" width={25} height={25} />
                    <Icon name="paper-plane-outline" fill="gray" width={25} height={25} />
                    <Icon name="upload" fill="gray" width={25} height={25} />
                </Layout>
                <Layout style={tailwind("flex-row pt-1")}>
                    <Text
                        style={tw`text-xs font-semibold`}>{`${this.props.stickerPack.views} Views`}</Text>
                    <Text
                        style={tw`text-xs pl-3 font-semibold`}>{`${this.props.stickerPack.likes} Likes`}</Text>
                    <Text
                        style={tw`text-xs pl-3 font-semibold`}>{`${this.props.stickerPack.likes} Followers`}</Text>
                </Layout>
            </Layout>
        );
    }
}

type Props = StackScreenProps<HomeStackParamList, "StickerPackDetailScreen">;
export const StickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data } = useStickerPack(route.params.stickerPack.id);

    const uploadStickerMutation = useUploadStickerMutation(queryClient);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: HeaderTitle,
            headerTitleAlign: "left",
            headerRight: HeaderRight,
        });
    }, [data]);

    const onStickerPress = (data: StickerRo): void => {
        navigation.navigate("StickerScreen", { sticker: data });
    };

    const onHeaderPress = () => {
        if (data == undefined) {
            return;
        }

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
        const stickerMap: { [id: string]: String } = {};
        for (let sticker of data?.stickers || []) {
            stickerMap[sticker.id + STICKER_FILE_EXTENSION] = "🦘";
        }

        // TODO: add empty stickers in order to reach > 2 stickers?
        if (!data) {
            // TODO: Error feedback to user.
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
                    <Button status={"success"} onPress={onAddToWhatsapp}>
                        Add to WhatsApp!
                    </Button>
                    <Body stickerPack={data} onStickerPress={onStickerPress} />
                    <ToolBar stickerPack={data} />
                </>
            )}
        </SafeAreaView>
    );
};
