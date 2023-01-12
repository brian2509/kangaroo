import React from "react";

import { TouchableOpacity } from "react-native";
import { Button, Layout, ModalService, Text } from "@ui-kitten/components";
import tailwind from "tailwind-rn";

export const showConfirmModal = (
    message: string,
    buttonText: string,
    onPressConfirm: () => void,
    onPressCancel?: () => void
): void => {
    let modalId = ''

    const hideModal = () => ModalService.hide(modalId)

    const pressConfirm = () => {
        onPressConfirm();
        hideModal();
    }

    const pressCancel = () => {
        onPressCancel && onPressCancel();
        hideModal();
    };

    modalId = ModalService.show(
        <TouchableOpacity
            style={tailwind("w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50")}
            onPress={hideModal}
        >
            <Layout style={tailwind("flex bg-white p-6 rounded-2xl w-3/4")}>
                <Text style={tailwind("font-bold")}>
                    {message}
                </Text>
                <Layout style={tailwind("flex flex-col justify-around mt-6")}>
                    <Button onPress={pressConfirm} status="danger">
                        {buttonText}
                    </Button>
                    <Button onPress={pressCancel} status="basic" appearance="ghost" size="small">
                        Cancel
                    </Button>
                </Layout>
            </Layout>
        </TouchableOpacity>,
        {
            onBackdropPress: hideModal,
        }
    );
}