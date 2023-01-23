import React from "react";
import tailwind from "tailwind-rn";
import { Layout, Text } from "@ui-kitten/components";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { lastUpdatedString } from "../../util/time";
import { lastUpdatedInStickerPack } from "../../util/stickerpack_utils";

interface Props {
    stickerPack: StickerPackRo;
    notifications: number;
}

export const StickerPackSideInfo = ({ stickerPack, notifications }: Props): JSX.Element => {
    const lastUpdated = lastUpdatedInStickerPack(stickerPack);

    return (
        <Layout style={tailwind("flex-col items-end")}>
            <Text style={tailwind("pb-2 pt-3 text-gray-500")} category="p2">
                {lastUpdatedString(lastUpdated)}
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
