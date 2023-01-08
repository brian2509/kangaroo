import React from "react";
import tailwind from "tailwind-rn";
import { Layout, List, Text } from "@ui-kitten/components";
import { TouchableOpacity, ListRenderItemInfo } from "react-native";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../common/CoverStickerImage";
import { StickerPreviews } from "./StickerPreviews";
import { StickerPackStats } from "./StickerPackStats";
import { StickerPackSideInfo } from "./StickerPackSideInfo";

interface StickerPackListComponentProps {
    stickerPack: StickerPackRo;
    onPressStickerPack: () => void;
}
const StickerPackListComponent = ({ stickerPack, onPressStickerPack }: StickerPackListComponentProps): React.ReactElement => {
    //TODO: add number of notifications to stickerpacks
    const numberOfNotifications = 0;

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPressStickerPack}
        >
            <Layout style={tailwind("flex-row w-full h-20 bg-white")}>
                <Layout style={tailwind("w-20 mx-1 justify-center items-center")}>
                    <CoverStickerImage stickerPack={stickerPack} />
                </Layout>
                <Layout
                    style={tailwind(
                        "flex-row flex-grow py-2 pr-4 border-b border-gray-100 justify-between",
                    )}>
                    <Layout style={tailwind("flex-col justify-around")}>
                        <Text style={tailwind("text-base font-semibold")}>{stickerPack.name}</Text>
                        <StickerPreviews stickerPack={stickerPack} />
                        <StickerPackStats stickerPack={stickerPack} />
                    </Layout>
                    <StickerPackSideInfo
                        stickerPack={stickerPack}
                        notifications={numberOfNotifications}
                    />
                </Layout>
            </Layout>
        </TouchableOpacity>
    );
};


interface StickerPacksListProps {
    stickerPacks: StickerPackRo[];
    refreshing: boolean;
    onRefresh: () => void;
    onPressStickerPack: (stickerPack: StickerPackRo) => void;
}
export const StickerPacksList = ({ stickerPacks, refreshing, onRefresh, onPressStickerPack }: StickerPacksListProps): JSX.Element => {
    return (
        <Layout style={tailwind("flex-1")}>
            <List
                style={tailwind("w-full")}
                data={stickerPacks}
                renderItem={({ item }: ListRenderItemInfo<StickerPackRo>) => (
                    <StickerPackListComponent
                        stickerPack={item}
                        onPressStickerPack={() => onPressStickerPack(item)}
                    />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </Layout>
    );
}
