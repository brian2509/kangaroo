import React from "react";
import tailwind from "tailwind-rn";
import { Layout, List, Text } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../../common/CoverStickerImage";
import { StickerPreviews } from "./StickerPreviews";
import { StickerPackStats } from "./StickerPackStats";
import { StickerPackSideInfo } from "./StickerPackSideInfo";

interface Props {
    stickerPacks: StickerPackRo[] | undefined;
    refreshing: boolean;
    onRefresh: () => void;
    onPressStickerPack: (stickerPack: StickerPackRo) => void;
}

export class StickerPacksList extends React.Component<Props> {
    StickerPackComponent = ({ item }: { item: StickerPackRo }): React.ReactElement => {
        //TODO: add number of notifications to stickerpacks
        const numberOfNotifications = 1;

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this.props.onPressStickerPack(item);
                }}>
                <Layout style={tailwind("flex-row w-full h-20 bg-white")}>
                    <Layout style={tailwind("w-20 mx-1 justify-center items-center")}>
                        <CoverStickerImage stickerPack={item} />
                    </Layout>
                    <Layout
                        style={tailwind(
                            "flex-row flex-grow py-2 pr-4 border-b border-gray-100 justify-between",
                        )}>
                        <Layout style={tailwind("flex-col justify-around")}>
                            <Text style={tailwind("text-base font-semibold")}>{item.name}</Text>
                            <StickerPreviews stickerPack={item} />
                            <StickerPackStats stickerPack={item} />
                        </Layout>
                        <StickerPackSideInfo
                            stickerPack={item}
                            notifications={numberOfNotifications}
                        />
                    </Layout>
                </Layout>
            </TouchableOpacity>
        );
    };

    render(): React.ReactElement {
        const { stickerPacks, refreshing, onRefresh } = this.props;

        return (
            <Layout style={tailwind("flex-1")}>
                <List
                    style={tailwind("w-full")}
                    data={stickerPacks}
                    renderItem={this.StickerPackComponent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            </Layout>
        );
    }
}
