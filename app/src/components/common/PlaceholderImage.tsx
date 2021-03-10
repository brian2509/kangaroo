import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import tw from "tailwind-react-native-classnames";

const PLACEHOLDER_STICKER_PATH = "../../assets/placeholders/sticker_placeholder.png";
const DEFAULT_IMAGE_STYLE = tw`w-14 h-14 rounded-full`;

interface Props {
    style?: StyleProp<ImageStyle>;
}

export const PlaceholderImage = ({ style = DEFAULT_IMAGE_STYLE }: Props): React.ReactElement => {
    return <Image style={style} source={require(PLACEHOLDER_STICKER_PATH)} />;
};
