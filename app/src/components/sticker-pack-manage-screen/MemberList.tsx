import React, { useEffect, useState } from "react";
import { Divider, Icon, List, ListItem } from "@ui-kitten/components";
import { StickerPackRo, UserRo } from "../../api/generated-typescript-api-client/src";
import { fullMemberList, isAuthor } from "../../util/stickerpack_utils";
import { Text } from "react-native";
import { MemberClickedModal } from "./MemberClickedModal";
import tw from "tailwind-react-native-classnames";

interface Props {
    stickerPack: StickerPackRo;
}

export const MemberList = ({ stickerPack }: Props): JSX.Element => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [clickedMember, setClickedMember] = useState<UserRo | undefined>();

    useEffect(() => {
        const shouldOpenModal = clickedMember != undefined;
        setModalVisible(shouldOpenModal);
    }, [clickedMember]);

    const closeModal = () => {
        setModalVisible(false);
        setClickedMember(undefined);
    };

    const renderItem = ({ item: user }: { item: UserRo }) => (
        <ListItem
            onPress={() => {
                setClickedMember(user);
            }}
            title={`${user.username}`}
            accessoryLeft={(props) => <Icon {...props} name="person" />}
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
                data={fullMemberList(stickerPack)}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
            />
            {clickedMember && (
                <MemberClickedModal
                    selectedMember={clickedMember}
                    modalVisible={modalVisible}
                    closeModal={closeModal}
                />
            )}
        </>
    );
};
