import React from "react";
import tailwind from "tailwind-rn";
import { Layout, Text } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native";
import { ProfileIcon } from "../common/ProfileIcon";

interface Props {
    onPressProfile: () => void;
}
export const HomeScreenHeader = ({ onPressProfile }: Props): JSX.Element => {
    return (
        <Layout style={tailwind("flex-row p-4 pt-6 bg-gray-100 items-center")}>
            <TouchableOpacity onPressIn={onPressProfile}>
                <ProfileIcon size={8} />
            </TouchableOpacity>
            <Text style={tailwind("pl-4 text-4xl font-bold")}>
                Sticker Packs
            </Text>
        </Layout >
    );
}
