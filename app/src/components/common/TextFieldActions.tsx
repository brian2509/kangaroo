import { Button, Layout, Spinner, Text } from "@ui-kitten/components";
import React from "react";
import tailwind from "tailwind-rn";

interface Props {
    cancelTitle: string;
    doneTitle: string;
    onCancelPress?: () => void;
    onDonePress?: () => void;
    isLoading?: boolean;
}

export const TextFieldActions = ({ cancelTitle, doneTitle, onCancelPress, onDonePress, isLoading }: Props): React.ReactElement => {
    return (
        <Layout style={tailwind("flex-col items-center justify-between bg-transparent")}>
            <Button
                size="medium"
                style={tailwind("w-full mb-2")}
                onPress={onDonePress}
                disabled={isLoading}
                accessoryLeft={() => (isLoading ? <Spinner size="small" status="basic" /> : <></>)}
            >
                {doneTitle}
            </Button>
            <Button
                style={tailwind("font-semibold")}
                onPress={onCancelPress}
                appearance="ghost"
            >
                {cancelTitle}
            </Button>
        </Layout>
    );
};
