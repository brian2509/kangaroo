import React from "react";
import { Button, Layout, Modal, Spinner, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";

interface Props {
    modalVisible: boolean;
    hideModal: () => void;
    onDeleteSticker: () => void;
    isDeleting: boolean;
}

export const DeleteStickerModal = ({
    modalVisible,
    hideModal,
    isDeleting,
    onDeleteSticker,
}: Props): JSX.Element => (
    <Modal
        visible={modalVisible}
        style={tw`w-60`}
        backdropStyle={tw`bg-black bg-opacity-50`}
        onBackdropPress={hideModal}>
        <Layout style={tw`rounded-2xl`}>
            <Text style={tw`pt-4 pb-1 text-xs text-gray-500 text-center`}>
                {isDeleting ? "Deleting sticker..." : "Are you sure?"}
            </Text>
            <Layout style={tw`flex h-16 w-full rounded-2xl justify-center items-center`}>
                {isDeleting ? (
                    <Spinner size="giant" />
                ) : (
                    <Button
                        status="danger"
                        size="large"
                        appearance="ghost"
                        style={tw`w-full h-full`}
                        onPress={onDeleteSticker}>
                        Delete
                    </Button>
                )}
            </Layout>
        </Layout>
    </Modal>
);
