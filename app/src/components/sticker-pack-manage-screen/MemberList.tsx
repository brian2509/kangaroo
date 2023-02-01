import React from "react";
import { Divider, Icon, List, ListItem } from "@ui-kitten/components";
import { StickerPackRo, UserRo } from "../../api/generated-typescript-api-client/src";
import { isAuthor } from "../../util/stickerpack_utils";
import { Text } from "react-native";
import tw from "tailwind-react-native-classnames";

interface Props {
    stickerPack: StickerPackRo;
    onPressMember: (user: UserRo | undefined) => void;
}

export const MemberList = ({ stickerPack, onPressMember }: Props): JSX.Element => {

    const renderItem = ({ item: user }: { item: UserRo }) => (
        <ListItem
            onPress={() => {
                onPressMember(user);
            }}
            title={`${user.username}`}
            accessoryLeft={(props) => <Icon name="person" {...props} />}
            accessoryRight={() => {
                if (!isAuthor(stickerPack, user)) {
                    return <></>;
                }
                return <Text style={tw`text-gray-500 text-xs pr-3`}>Author</Text>;
            }}
        />
    );

    return (
        <>
            <List
                data={stickerPack.members}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
            />
        </>
    );
};
