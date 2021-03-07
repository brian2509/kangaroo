import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import tw from "tailwind-react-native-classnames";

export const TextStatElement = ({
    value,
    text,
}: {
    value: number;
    text: string;
}): React.ReactElement => {
    return (
        <Layout style={tw`flex-row bg-transparent`}>
            <Text style={tw`pr-2 text-xs`}>{value}</Text>
            <Text style={tw`pr-6 text-xs text-gray-400`}>{text}</Text>
        </Layout>
    );
};
