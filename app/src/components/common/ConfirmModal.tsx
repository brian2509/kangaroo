import React from "react";

import { TouchableOpacity } from "react-native";
import { Button, Layout, ModalService, Text } from "@ui-kitten/components";
import tailwind from "tailwind-rn";

interface ConfirmModalProps {
    message: string;
    buttonText: string;
    onPressConfirm: () => void;
    onPressCancel?: () => void;
    status?: "basic" | "primary" | "success" | "info" | "warning" | "danger" | "control";
}
export const showConfirmModal = ({ message, buttonText, onPressConfirm, onPressCancel, status }: ConfirmModalProps): void => {
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
            onPress={pressCancel}
        >
            <Layout style={tailwind("flex flex-col items-center bg-white py-4 rounded-2xl w-3/4")}>
                <Text style={tailwind("my-1")}>
                    {message}
                </Text>
                <Layout style={tailwind("flex flex-col justify-around mt-1")}>
                    <Button onPress={pressConfirm} status={status} appearance="ghost" size="large">
                        {buttonText}
                    </Button>
                </Layout>
            </Layout>
        </TouchableOpacity>,
        {
            onBackdropPress: pressCancel,
        }
    );
}