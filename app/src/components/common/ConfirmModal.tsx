import React from "react";

import { TouchableOpacity } from "react-native";
import { Button, Layout, Modal, ModalService, Spinner, Text } from "@ui-kitten/components";
import tailwind from "tailwind-rn";

interface ConfirmModalProps {
    message: string;
    buttonText: string;
    isLoading?: boolean;
    loadingMessage?: string;
    onPressConfirm: () => void;
    onPressCancel?: () => void;
    status?: "basic" | "primary" | "success" | "info" | "warning" | "danger" | "control";
}
const ConfirmModalComponent = ({ message, buttonText, isLoading, loadingMessage, onPressConfirm, onPressCancel, status = "primary" }: ConfirmModalProps) => {
    return (
        <TouchableOpacity
            style={tailwind("w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50")}
            onPress={onPressCancel}
        >
            <Layout style={tailwind("flex flex-col items-center bg-white py-4 rounded-2xl w-3/4")}>
                <Text style={tailwind("my-1")}>
                    {isLoading ? (loadingMessage ?? message) : message}
                </Text>
                <Layout style={tailwind("flex flex-col justify-around my-1")}>
                    {isLoading
                        ? (
                            <Spinner size="giant" />
                        ) : (
                            <>
                                <Button onPress={onPressConfirm} status={status} appearance="ghost" size="large">
                                    {buttonText}
                                </Button>
                                <Button onPress={onPressCancel} status="basic" appearance="ghost">
                                    Cancel
                                </Button>
                            </>
                        )}
                </Layout>
            </Layout>
        </TouchableOpacity>
    )
}

type ConfirmModalMethodProps = Omit<ConfirmModalProps, "isLoading" | "loadingMessage">;
export const showConfirmModal = ({ message, buttonText, onPressConfirm, onPressCancel, status }: ConfirmModalMethodProps): void => {
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
        <ConfirmModalComponent
            message={message}
            buttonText={buttonText}
            onPressConfirm={pressConfirm}
            onPressCancel={pressCancel}
            status={status}
        />,
        {
            onBackdropPress: pressCancel,
        }
    );
}

interface ConfirmModalComponentProps extends ConfirmModalProps {
    visible: boolean;
    hideModal: () => void;
}
export const ConfirmModal = ({ visible, hideModal, message, buttonText, isLoading, loadingMessage, onPressCancel, onPressConfirm, status }: ConfirmModalComponentProps): JSX.Element => {
    const pressCancel = () => {
        onPressCancel && onPressCancel();
        hideModal();
    };

    return (
        <Modal visible={visible} style={tailwind("flex-1 w-full h-full")}>
            <ConfirmModalComponent
                message={message}
                buttonText={buttonText}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                onPressConfirm={onPressConfirm}
                onPressCancel={pressCancel}
                status={status}
            />
        </Modal>
    )
}