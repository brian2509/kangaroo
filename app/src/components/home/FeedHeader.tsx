import { Layout, Input, Icon } from "@ui-kitten/components";
import React from "react";
import tw from "tailwind-react-native-classnames";
import { ProfileIcon } from "../common/ProfileIcon";

interface FeedProps {
    profilePhotoUri?: string;
}

export const FeedHeader = ({ profilePhotoUri }: FeedProps): React.ReactElement => {
    return (
        <Layout style={tw`w-full flex-row`}>
            <ProfileIcon imageUri={profilePhotoUri}></ProfileIcon>
            <Input
                accessoryLeft={(props: any) => <Icon {...props} name="search" />}
                size="small"
                style={tw`rounded-xl ml-3 flex-1`}
                placeholder="Search"
            />
        </Layout>
    );
};
