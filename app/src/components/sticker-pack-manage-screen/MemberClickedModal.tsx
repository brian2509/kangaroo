import React from "react";
import { Button, Card, Modal, Text } from "@ui-kitten/components";
import { UserRo } from "../../api/generated-typescript-api-client/src";
import tw from "tailwind-react-native-classnames";

interface Props {
    selectedMember: UserRo;
    modalVisible: boolean;
    closeModal: () => void;
}

export const MemberClickedModal = ({
    selectedMember,
    modalVisible,
    closeModal,
}: Props): JSX.Element => {
    return (
        <Modal
            visible={modalVisible}
            style={tw`w-60`}
            backdropStyle={tw`bg-black bg-opacity-50`}
            onBackdropPress={closeModal}>
            <Card
                disabled={true}
                header={() => (
                    <Text style={tw`p-3 text-xs text-gray-500 text-center`}>
                        {selectedMember?.username}
                    </Text>
                )}
                footer={() => (
                    <Button size="medium" appearance="ghost" onPress={closeModal}>
                        Close
                    </Button>
                )}>
                <Button size="medium" appearance="ghost" status="basic">
                    Show Account
                </Button>
                <Button size="medium" appearance="ghost" status="basic">
                    Remove as Admin
                </Button>
                <Button status="danger" size="medium" appearance="ghost">
                    Remove from Pack
                </Button>
            </Card>
        </Modal>
    );
};
