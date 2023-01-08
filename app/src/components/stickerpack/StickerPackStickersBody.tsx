import React from "react"
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";

import { Layout, Text } from "@ui-kitten/components"
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { lastUpdatedString } from "../../util/time";

interface RenderStickerProps {
    sticker: StickerRo,
    onStickerPress: (sticker: StickerRo) => void;
}
const Sticker = ({ sticker, onStickerPress }: RenderStickerProps): JSX.Element => {
    return (
        <TouchableOpacity
            key={sticker.id}
            style={{
                width: "23%",
                height: "auto",
                marginHorizontal: "1%",
                marginVertical: "1%",
            }}
            onPress={() => onStickerPress(sticker)}
        >
            <Image
                style={tw.style("rounded-lg", {
                    width: "100%",
                    paddingBottom: "100%",
                    borderRadius: 3,
                })}
                source={{ uri: sticker.fileUrl }}
            />
        </TouchableOpacity>
    );
};

interface StickersProps {
    stickerPack: StickerPackRo;
    onStickerPress: (sticker: StickerRo) => void;
}
const Stickers = ({ stickerPack, onStickerPress }: StickersProps): JSX.Element => {
    return (
        <Layout style={tailwind("flex-row flex-wrap pt-4")}>
            {stickerPack.stickers.map((sticker) => (
                <Sticker
                    key={sticker.id}
                    sticker={sticker}
                    onStickerPress={onStickerPress}
                />
            ))}
        </Layout>
    );
}


interface StickerPackBodyProps {
    stickerPack: StickerPackRo;
    onStickerPress: (sticker: StickerRo) => void;
}
const StickerPackBody = ({ stickerPack, onStickerPress }: StickerPackBodyProps): JSX.Element => {
    return (
        <ScrollView style={tailwind("p-4")}>
            <Layout style={tailwind("flex-row justify-between items-baseline")}>
                <Layout style={tailwind("flex-row items-baseline")}>
                    <Text style={tailwind("text-2xl font-bold mr-4")}>Stickers</Text>
                    <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                        {stickerPack.stickers.length}/30
                    </Text>
                </Layout>
                <Text style={tailwind("text-gray-500 pt-3 text-xs")}>Last updated: {lastUpdatedString(stickerPack.updatedAt)}</Text>
            </Layout>
            <Stickers
                stickerPack={stickerPack}
                onStickerPress={onStickerPress}
            />
        </ScrollView>
    );
}

export default StickerPackBody;