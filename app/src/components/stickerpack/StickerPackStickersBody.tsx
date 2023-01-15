import React from "react"
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";

import { Layout, Text } from "@ui-kitten/components"
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { lastUpdatedString } from "../../util/time";
import { lastUpdatedInStickerPack } from "../../util/stickerpack_utils";

const STICKERS_PER_ROW = 4;

interface RenderStickerProps {
    sticker: StickerRo,
    onStickerPress?: (sticker: StickerRo) => void;
    stickersPerRow: number;
}
const StickerGridCell = ({ sticker, onStickerPress, stickersPerRow = 4 }: RenderStickerProps): JSX.Element => {
    return (
        <TouchableOpacity
            key={sticker.id}
            style={{
                width: `${(Math.floor(100 / stickersPerRow)) - 2}%`,
                height: "auto",
                marginHorizontal: "1%",
                marginVertical: "1%",
            }}
            onPress={() => onStickerPress && onStickerPress(sticker)}
            delayLongPress={200}
            disabled={!onStickerPress}
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
    stickers: StickerRo[];
    onStickerPress?: (sticker: StickerRo) => void;
    stickersPerRow?: number;
}
export const StickerGrid = ({ stickers, onStickerPress, stickersPerRow = 4 }: StickersProps): JSX.Element => {
    return (
        <Layout style={tailwind("w-full flex-row flex-wrap")}>
            {stickers.map((sticker) => (
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

    const lastUpdated = lastUpdatedInStickerPack(stickerPack);

    return (
        <ScrollView style={tailwind("p-6")}>
            <Layout style={tailwind("flex-row justify-between items-baseline pb-4 pt-2")}>
                <Layout style={tailwind("flex-row items-baseline")}>
                    <Text>
                        <Text style={tailwind("text-2xl font-bold")}>
                            Stickers
                        </Text>
                        {"    "}
                        <Text style={tailwind("text-sm text-gray-500")}>
                            {stickerPack.stickers.length}/30
                        </Text>
                    </Text>
                </Layout>
                <Text style={tailwind("text-gray-500 pb-2 text-xs")}>
                    Last updated: {lastUpdatedString(lastUpdated)}
                </Text>
            </Layout>
            <StickerGrid
                stickers={stickerPack.stickers}
                onStickerPress={onStickerPress}
                stickersPerRow={STICKERS_PER_ROW}
            />
        </ScrollView>
    );
}

export default StickerPackBody;