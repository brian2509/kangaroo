import React from "react"
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";

import { Layout, Text } from "@ui-kitten/components"
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { lastUpdatedString } from "../../util/time";

const STICKERS_PER_ROW = 4;

interface RenderStickerProps {
    sticker: StickerRo,
    onStickerPress: (sticker: StickerRo) => void;
    stickersPerRow: number;
}
const StickerGridCell = ({ sticker, onStickerPress, stickersPerRow = 4 }: RenderStickerProps): JSX.Element => {
    return (
        <TouchableOpacity
            key={sticker.id}
            style={{
                width: `${(Math.floor(100 / stickersPerRow)) - 2.01}%`,
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
    stickersPerRow?: number;
}
const StickerGrid = ({ stickerPack, onStickerPress, stickersPerRow = 4 }: StickersProps): JSX.Element => {
    return (
        <Layout style={tailwind("flex-row flex-wrap")}>
            {stickerPack.stickers.map((sticker) => (
                <StickerGridCell
                    key={sticker.id}
                    sticker={sticker}
                    onStickerPress={onStickerPress}
                    stickersPerRow={stickersPerRow}
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
            <Layout style={tailwind("flex-row justify-between items-baseline pb-4")}>
                <Layout style={tailwind("flex-row items-baseline")}>
                    <Text style={tailwind("text-2xl font-bold mr-4")}>Stickers</Text>
                    <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                        {stickerPack.stickers.length}/30
                    </Text>
                </Layout>
                <Text style={tailwind("text-gray-500 pt-3 text-xs")}>Last updated: {lastUpdatedString(stickerPack.updatedAt)}</Text>
            </Layout>
            <StickerGrid
                stickerPack={stickerPack}
                onStickerPress={onStickerPress}
                stickersPerRow={STICKERS_PER_ROW}
            />
        </ScrollView>
    );
}

export default StickerPackBody;