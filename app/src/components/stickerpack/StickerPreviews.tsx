import React from "react";
import tailwind from "tailwind-rn";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { Image } from "react-native";
import { Layout, Text } from "@ui-kitten/components";

const STICKERS_IN_PREVIEW = 5;

interface Props {
    stickerPack: StickerPackRo;
}

export class StickerPreviews extends React.Component<Props> {
    render(): React.ReactElement {
        const { stickerPack } = this.props;
        const stickersToPreview = stickerPack.stickers.slice(1, 1 + STICKERS_IN_PREVIEW);
        const stickersLeft = stickerPack.stickers.length - STICKERS_IN_PREVIEW - 1;

        return (
            <Layout style={tailwind("flex-row pb-1 items-center")}>
                {stickersToPreview.map((sticker) => (
                    <Layout
                        key={sticker.id}
                        style={tailwind(
                            "w-5 h-5 mx-0.5 bg-gray-200 justify-center items-center rounded",
                        )}>
                        <Image
                            style={tailwind("w-3.5 h-3.5 opacity-75")}
                            source={{
                                uri: sticker.fileUrl,
                            }}
                        />
                    </Layout>
                ))}

                {stickersLeft > 0 && (
                    <Layout
                        style={tailwind(
                            "ml-1 w-6 h-4 bg-gray-100 rounded items-center justify-center",
                        )}>
                        <Text style={tailwind("text-xs font-thin text-gray-400")}>
                            +{stickersLeft}
                        </Text>
                    </Layout>
                )}
            </Layout>
        );
    }
}
