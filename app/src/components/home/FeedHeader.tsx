import { Layout, Input, Icon } from "@ui-kitten/components";
import React from "react";
import tw from "tailwind-react-native-classnames";

interface FeedProps {
    profilePhoto: string;
}

export const FeedHeader = ({ profilePhoto }: FeedProps): React.ReactElement => {
    return (
        <Layout style={tw`w-full`}>
            <Input
                accessoryLeft={(props: any) => <Icon {...props} name="search" />}
                style={tw`rounded-xl`}
                placeholder="Search"
            />
        </Layout>
    );
};
