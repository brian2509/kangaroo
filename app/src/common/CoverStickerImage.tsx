import React from "react";
import tw from "tailwind-react-native-classnames";
import { StickerPackRo } from "../api/generated-typescript-api-client/src";
import { Image, ImageStyle, StyleProp } from "react-native";

const PLACEHOLDER_STICKER_PATH = "../assets/placeholders/sticker_placeholder.png";
const DEFAULT_IMAGE_STYLE = tw`w-14 h-14 rounded-full`;

interface Props {
    stickerPack: StickerPackRo;
    style?: StyleProp<ImageStyle>;
}

export const CoverStickerImage = ({
    stickerPack,
    style = DEFAULT_IMAGE_STYLE,
}: Props): React.ReactElement => {
    return stickerPack.stickers.length > 0 ? (
        <Image
            style={style}
            source={{
                uri: stickerPack.stickers[0].fileUrl,
            }}
        />
    ) : (
        <Image style={style} source={require(PLACEHOLDER_STICKER_PATH)} />
    );
};
