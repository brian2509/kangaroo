import React from "react"
import tailwind from "tailwind-rn";

import { Icon, Layout, Text } from "@ui-kitten/components"
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../common/CoverStickerImage";
import { TouchableOpacity } from "react-native";
import { CHEVRON_ICON_COLOR } from "../../constants/colors";

interface Props {
    stickerPack: StickerPackRo;
    onHeaderPress?: () => void;
}
const StickerPackHeader = ({ stickerPack, onHeaderPress }: Props): JSX.Element => {
    const numMembers = stickerPack.members.length;

    return (
        <TouchableOpacity
            style={tailwind("flex flex-row justify-between items-center p-4 border-b-2 border-gray-200")}
            onPress={onHeaderPress}
            disabled={onHeaderPress === undefined}
        >
            <Layout style={tailwind("flex flex-row items-center")}>
                <CoverStickerImage
                    stickerPack={stickerPack}
                    style={tailwind("w-20 h-20 ml-2 mr-6 rounded-full")}
                />
                <Layout style={tailwind("flex flex-col justify-center")}>
                    <Text style={tailwind("text-xl font-bold")}>
                        {stickerPack.name}
                    </Text>
                    <Text style={tailwind("text-xs mb-2")}>
                        {stickerPack.author.username}
                    </Text>
                    <Text style={tailwind("text-xs")}>
                        {numMembers} member{numMembers === 1 ? "" : "s"}
                    </Text>
                </Layout>
            </Layout>
            {onHeaderPress ? (
                <Icon
                    style={tailwind("w-8 h-8")}
                    fill={CHEVRON_ICON_COLOR}
                    name='chevron-right-outline'
                />
            ) : null}
        </TouchableOpacity >
    )
}

export default StickerPackHeader;
