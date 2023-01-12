import React from "react";
import tailwind from "tailwind-rn";
import { Icon, Layout, Text } from "@ui-kitten/components";
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
            {/* <TouchableOpacity onPressIn={onPressProfile} style={tailwind("bg-gray-300 rounded-full p-2")}>
                <Icon
                    style={tailwind("w-8 h-8")}
                    fill='#8F9BB3'
                    name='person'
                />
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPressIn={onPressProfile} >
                <ProfileIcon size={10} />
            </TouchableOpacity> */}
        </Layout >
    );
}
