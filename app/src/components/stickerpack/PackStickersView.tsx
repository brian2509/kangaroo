import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { Image, TouchableOpacity } from "react-native";
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import tw from "tailwind-react-native-classnames";

interface Props {
    stickerPack: StickerPackRo;
    onStickerPress?: (sticker: StickerRo) => void;
}

export const PackStickersView = ({ stickerPack, onStickerPress }: Props): JSX.Element => {
    const renderSticker = (sticker: StickerRo): JSX.Element => {
        return (
            <TouchableOpacity
                key={sticker.id}
                style={{
                    width: "21%",
                    height: "auto",
                    marginHorizontal: "2%",
                    marginBottom: "3.5%",
                }}
                disabled={onStickerPress == undefined}
                onPress={() => {
                    onStickerPress?.(sticker);
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

    return (
        <Layout style={tw`flex-col p-2 pt-1 pb-8`}>
            <Layout style={tw`flex-row flex-grow justify-between items-baseline`}>
                <Text style={tw`font-semibold mr-4`}>
                    Willem Alexander
                    <Text style={tw`text-xs text-gray-500`}> ({stickerPack.stickers.length})</Text>
                </Text>
                <Text style={tw`text-gray-500 pt-3 text-xs`}>Wed 4:20</Text>
            </Layout>
            <Layout style={tw`flex-row flex-wrap pt-3`}>
                {stickerPack.stickers.map(renderSticker)}
            </Layout>
        </Layout>
    );
};
