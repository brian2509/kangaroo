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
        <Layout style={tailwind("flex-row p-6 bg-gray-100 items-center border-b border-gray-300")}>
            <TouchableOpacity onPressIn={onPressProfile} style={tailwind("mr-6")}>
                <ProfileIcon size={10} />
            </TouchableOpacity>
            <Text style={tailwind("text-4xl font-bold")}>
                Sticker Packs
            </Text>
        </Layout >
    );
}
