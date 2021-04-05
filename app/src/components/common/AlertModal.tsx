import React from "react";
import { Button, Card, Layout, Modal, Text } from "@ui-kitten/components";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";

interface Props {
    message: string | undefined;
    visible: boolean;
    onDismiss: () => void;
}
export const AlertModal = (props: Props): React.ReactElement => {
    return (
        <Modal
            style={tw`mr-10`}
            visible={props.visible}
            backdropStyle={tw`bg-black bg-opacity-50`}
            onBackdropPress={() => props.onDismiss()}>
            <Card disabled={true} style={tw`rounded-2xl`}>
                <Text style={tw`text-center my-4`}>{props.message}</Text>
                <Button
                    size={"large"}
                    appearance={"ghost"}
                    status={"danger"}
                    onPress={() => props.onDismiss()}>
                    DISMISS
                </Button>
            </Card>
        </Modal>
    );
};
