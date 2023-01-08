import React, { useMemo } from "react";
import tailwind from "tailwind-rn";
import { Layout, List, Text } from "@ui-kitten/components";
import { TouchableOpacity, ListRenderItemInfo } from "react-native";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../common/CoverStickerImage";
import { StickerPreviews } from "./StickerPreviews";
import { StickerPackStats } from "./StickerPackStats";
import { StickerPackSideInfo } from "./StickerPackSideInfo";
import { lastUpdatedString } from "../../util/time";
import { StickerGrid } from "./StickerPackStickersBody";

const TRUNCATE_STICKERS = 7;

interface StickerPackListComponentProps {
    stickerPack: StickerPackRo;
    onPressStickerPack: () => void;
}
const StickerPackListComponent = ({ stickerPack, onPressStickerPack }: StickerPackListComponentProps): React.ReactElement => {
    // const numMembers = stickerPack.members.length + 1;
    const numStickers = stickerPack.stickers.length;

    const truncated = useMemo(() => {
        return [...stickerPack.stickers].splice(0, TRUNCATE_STICKERS)
    }, [stickerPack])
    const stickersLeft = stickerPack.stickers.length - TRUNCATE_STICKERS;

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPressStickerPack}
        >
            <Layout style={tailwind("flex flex-col p-4 border-b border-gray-200")}>
                <Layout style={tailwind("flex flex-row justify-between")}>
                    <Layout style={tailwind("flex flex-row items-center")}>
                        <CoverStickerImage stickerPack={stickerPack} style={tailwind("w-12 h-12 rounded-full")} />
                        <Layout style={tailwind("flex flex-col ml-4")}>
                            <Text style={tailwind("text-lg font-bold")}>
                                {stickerPack.name}
                            </Text>
                            <Text style={tailwind("text-xs text-gray-500")}>
                                {numStickers} sticker{numStickers !== 1 ? "s" : ""}
                            </Text>
                        </Layout>
                    </Layout>
                    <Layout>
                        <Text style={tailwind("text-gray-500 pt-3 text-sm")}>{lastUpdatedString(stickerPack.updatedAt)}</Text>
                    </Layout>
                </Layout>

                {stickerPack.stickers.length > 0 ? (
                    <Layout style={tailwind("mt-4 flex flex-row items-center justify-between")}>
                        <Layout style={tailwind("w-10/12")}>
                            <StickerGrid stickers={truncated} stickersPerRow={TRUNCATE_STICKERS} />
                        </Layout>
                        <Layout style={tailwind(
                            "w-1/12 " + (stickersLeft > 0 ? "" : "hidden")
                        )}>
                            <Text style={tailwind("text-white bg-gray-800 text-center rounded-lg p-1")}>+ {stickersLeft}</Text>
                        </Layout>
                    </Layout>
                ) : null}
            </Layout>
        </TouchableOpacity >
    );
};

interface StickerPackListComponentOLDProps {
    stickerPack: StickerPackRo;
    onPressStickerPack: () => void;
}
const StickerPackListComponent_OLD = ({ stickerPack, onPressStickerPack }: StickerPackListComponentOLDProps): React.ReactElement => {
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
