import React from "react";
import tailwind from "tailwind-rn";
import { Icon, Layout } from "@ui-kitten/components";
import { StyleProp, Text, TextStyle } from "react-native";

interface Props {
    text: string;
    iconName: string;
    textStyle: StyleProp<TextStyle>;
    isGrayed: boolean;
}

export const TextWithIcon = ({
    text,
    iconName,
    textStyle = {},
    isGrayed = false,
}: Props): React.ReactElement => {
    const fill = isGrayed ? "gray" : "black";
    return (
        <Layout style={tailwind(`flex-row pr-4`)}>
            <Text style={textStyle}>{text}</Text>
            <Icon name={iconName} fill={fill} width={17} height={17} />
        </Layout>
    );
};
