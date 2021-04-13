import React from "react";
import { Button, Icon, Layout } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";

interface Props {
    onPress: () => void;
}

export const DeleteStickerButton = ({ onPress }: Props): JSX.Element => {
    return (
        <Layout style={tw`flex-row mr-4`}>
            <Button
                status="danger"
                appearance="ghost"
                onPress={onPress}
                accessoryLeft={(props: any) => (
                    <Icon
                        name="trash-2-outline"
                        style={tw.style("w-6 h-6", {
                            tintColor: props.style.tintColor,
                        })}
                    />
                )}
            />
        </Layout>
    );
};
