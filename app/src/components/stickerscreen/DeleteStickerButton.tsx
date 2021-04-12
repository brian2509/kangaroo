import React from "react";
import { Button, Icon, Layout } from "@ui-kitten/components";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import tw from "tailwind-react-native-classnames";

interface Props {
    stickerPack: StickerPackRo;
    onPress: () => void;
}

export const DeleteStickerButton = ({ stickerPack, onPress }: Props): JSX.Element => {
    return (
        <Layout style={tw`flex-row mr-4`}>
            {stickerPack && (
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
            )}
        </Layout>
    );
};
