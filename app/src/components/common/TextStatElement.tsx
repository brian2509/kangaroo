import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import tw from "tailwind-react-native-classnames";

export const TextStatElement = ({
    value,
    text,
    style,
}: {
    value: number;
    text: string;
    style?: string;
}): React.ReactElement => {
    return (
        <Layout style={tw`flex-row bg-transparent ${style ?? ""}`}>
            <Text style={tw`pr-2 text-xs`}>{value}</Text>
            <Text style={tw`pr-4 text-xs text-gray-400`}>{text}</Text>
        </Layout>
    );
};
