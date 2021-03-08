import { Layout } from "@ui-kitten/components";
import React from "react";
import { ProfileIcon } from "./ProfileIcon";
import tw from "tailwind-react-native-classnames";

export const AccountProfileImage = (): React.ReactElement => {
    return (
        <Layout style={tw`flex-row justify-between mt-8`}>
            <Layout style={tw`border-b border-gray-300 w-20 self-center ml-8`}></Layout>
            <Layout style={tw`bg-transparent shadow-md`}>
                <ProfileIcon size={32}></ProfileIcon>
            </Layout>
            <Layout style={tw`border-b border-gray-300 w-20 self-center mr-8`}></Layout>
        </Layout>
    );
};
