import React from "react";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { Image, ImageStyle, StyleProp } from "react-native";
import { PlaceholderImage } from "./PlaceholderImage";
import tailwind from "tailwind-rn";

const DEFAULT_IMAGE_STYLE = tailwind("w-14 h-14 rounded-full");

interface Props {
    stickerPack: StickerPackRo;
    style?: StyleProp<ImageStyle>;
}

export const CoverStickerImage = ({
    stickerPack,
    style = DEFAULT_IMAGE_STYLE,
}: Props): React.ReactElement => {

    return stickerPack.trayIconImageFileUrlOriginal ? (
        <Image
            style={style}
            source={{ uri: stickerPack.trayIconImageFileUrlOriginal }}
        />
    ) : (
        <PlaceholderImage
            style={style}
        />
    );
};
