import { Button, Layout, Text } from "@ui-kitten/components";
import React from "react";
import tailwind from "tailwind-rn";

interface Props {
    cancelTitle: string;
    doneTitle: string;
    onCancelPress?: () => void;
    onDonePress?: () => void;
}

export const TextFieldActions = (props: Props): React.ReactElement => {
    return (
        <Layout style={tailwind("flex-row items-center justify-between pt-3 bg-transparent")}>
            <Text
                style={tailwind("pl-2 font-semibold text-blue-500")}
                onPress={props.onCancelPress}>
                {props.cancelTitle}
            </Text>
            <Button size="medium" style={tailwind("px-8 py-2")} onPress={props.onDonePress}>
                {props.doneTitle}
            </Button>
        </Layout>
    );
};
