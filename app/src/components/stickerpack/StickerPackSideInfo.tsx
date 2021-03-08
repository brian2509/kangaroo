import React from "react";
import tailwind from "tailwind-rn";
import { Layout, Text } from "@ui-kitten/components";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { lastUpdatedString } from "../../util/time";

interface Props {
    stickerPack: StickerPackRo;
    notifications: number;
}

export class StickerPackSideInfo extends React.Component<Props> {
    render(): React.ReactElement {
        const { stickerPack, notifications } = this.props;

        return (
            <Layout style={tailwind("flex-col items-end")}>
                <Text style={tailwind("pb-2 py-1 text-gray-500")} category="p2">
                    {lastUpdatedString(stickerPack.updatedAt)}
                </Text>
                {notifications > 0 && (
                    <Layout
                        style={tailwind(
                            "w-5 h-5 rounded-full bg-blue-600 justify-center items-center",
                        )}>
                        <Text style={tailwind("text-white text-xs")}>{notifications}</Text>
                    </Layout>
                )}
            </Layout>
        );
    }
}
