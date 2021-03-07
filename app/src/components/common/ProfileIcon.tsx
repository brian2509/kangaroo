import React from "react";
import { Image, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

export const PLACEHOLDER_STICKER_PATH = "../../assets/placeholders/sticker_placeholder.png";
export const DEFAULT_IMAGE_STYLE = tw`h-8 w-8 rounded-full`;

interface Props {
    imageUri?: string;
    onPress?: () => void;
}

export const ProfileIcon = ({ imageUri, onPress }: Props): React.ReactElement => {
    return (
        <TouchableOpacity
            disabled={onPress == undefined}
            onPress={() => {
                onPress?.();
            }}>
            <Image
                style={DEFAULT_IMAGE_STYLE}
                source={
                    imageUri !== undefined
                        ? {
                              uri: imageUri,
                          }
                        : require(PLACEHOLDER_STICKER_PATH)
                }
            />
        </TouchableOpacity>
    );
};
