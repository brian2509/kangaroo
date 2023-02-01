import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/app/AppStackNavigator";
import { useQueryClient } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { StickerPackRo } from "../../../api/generated-typescript-api-client/src";
import { HomeScreenHeader } from "../../../components/home/HomeScreenHeader";
import { StickerPacksList } from "../../../components/stickerpack/StickerPackList";
import { sortedStickerPacks } from "../../../util/sorting";
import { useOwnAndJoinedStickerPacks } from "../../../api/hooks/query/stickerPack";
import { storeImages } from "../../../util/image_storing";
import { registerStickerPacks } from "../../..//util/sticker_registration";
import { FloatingAction } from "react-native-floating-action";

type Props = StackScreenProps<HomeStackParamList, "HomeScreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data: stickerPacks, isLoading, dataUpdatedAt } = useOwnAndJoinedStickerPacks();

    useEffect(() => {
        // TODO: move this to a more valid location?
        if (stickerPacks) {
            storeImages(stickerPacks);
            registerStickerPacks(stickerPacks);
        }
    }, [dataUpdatedAt]);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onPressProfile={() => {
                    navigation.navigate("SettingsScreen")
                }}
            />
            <StickerPacksList
                stickerPacks={sortedStickerPacks(stickerPacks || [])}
                refreshing={isLoading}
                onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks)}
                onPressStickerPack={(stickerPack: StickerPackRo) => {
                    navigation.navigate("StickerPackScreen", {
                        stickerPack,
                    });
                }}
            />
            <FloatingAction
                actions={[{
                    text: "Create Sticker Pack",
                    name: "create_sticker_pack",
                    icon: require("../../../assets/icons/plus.png"),
                }]}
                overrideWithAction
                onPressItem={() => {
                    navigation.navigate("CreateStickerPackScreen")
                }}
            />
        </SafeAreaView>
    );
};
