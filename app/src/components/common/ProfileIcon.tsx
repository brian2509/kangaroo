import React from "react";
import { Image, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const USE_GENERATED_PLACEHOLDERS = true;
export const PLACEHOLDER_STICKER_PATH = "../../assets/placeholders/sticker_placeholder.png";

interface Props {
    imageUri?: string;
    size?: number;
    onPress?: () => void;
}

export const ProfileIcon = ({ imageUri, size = 8, onPress }: Props): React.ReactElement => {
    return (
        <TouchableOpacity
            disabled={onPress == undefined}
            onPress={() => {
                onPress?.();
            }}>
            <Image
                style={tw`h-${size} w-${size} rounded-full`}
                source={
                    imageUri !== undefined
                        ? { uri: imageUri }
                        : (USE_GENERATED_PLACEHOLDERS
                            ? { uri: "https://i.pravatar.cc/300" }
                            : require(PLACEHOLDER_STICKER_PATH))
                }
            />
        </TouchableOpacity>
    );
};
