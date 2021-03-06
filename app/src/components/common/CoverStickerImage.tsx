import React from "react";
import tw from "tailwind-react-native-classnames";
import { StickerPackRo, StickerRo } from "../../api/generated-typescript-api-client/src";
import { Image, ImageStyle, StyleProp, TouchableOpacity } from "react-native";

const PLACEHOLDER_STICKER_PATH = "../../assets/placeholders/sticker_placeholder.png";
const DEFAULT_IMAGE_STYLE = tw`w-14 h-14 rounded-full`;

interface Props {
    stickerPack: StickerPackRo;
    style?: StyleProp<ImageStyle>;
    onStickerPress?: (sticker: StickerRo) => void;
}

export const CoverStickerImage = ({
    stickerPack,
    style = DEFAULT_IMAGE_STYLE,
    onStickerPress
}: Props): React.ReactElement => {
    return stickerPack.stickers.length > 0 ? (
        <TouchableOpacity
            disabled={onStickerPress == undefined}
            onPress={() => {
                if (onStickerPress) {
                    onStickerPress(stickerPack.stickers[0]);
                }
            }}>
                <Image
                    style={style}
                    source={{
                        uri: stickerPack.stickers[0].fileUrl,
                    }}
                    />
        </TouchableOpacity>
    ) : (
        <Image style={style} source={require(PLACEHOLDER_STICKER_PATH)} />
    );
};
