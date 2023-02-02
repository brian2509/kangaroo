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
import { useStickerPacks } from "../../../api/hooks/query/stickerPack";
import { storeImages } from "../../../util/image_storing";
import { registerStickerPacks } from "../../..//util/sticker_registration";
import { FloatingAction } from "react-native-floating-action";
import { Layout, Spinner } from "@ui-kitten/components";
import { NoStickerPacksScreen } from "../../../components/home/NoStickerPacksScreen";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data: myStickerPacks, isLoading, isFetching, dataUpdatedAt, refetch } = useStickerPacks();

    useEffect(() => {
        // TODO: move this to a more valid location?
        if (myStickerPacks) {
            storeImages(myStickerPacks);
            registerStickerPacks(myStickerPacks);
        }
    }, [dataUpdatedAt]);

    const onPressCreateStickerPack = () => {
        navigation.navigate("CreateStickerPackScreen");
    }

    const onPressStickerPack = (stickerPack: StickerPackRo) => {
        navigation.navigate("StickerPackScreen", {
            stickerPack,
        });
    }

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onPressProfile={() => {
                    navigation.navigate("SettingsScreen")
                }}
            />

            {myStickerPacks !== undefined && myStickerPacks.length > 0 ? (
                <>
                    <StickerPacksList
                        stickerPacks={sortedStickerPacks(myStickerPacks)}
                        refreshing={isLoading}
                        onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}
                        onPressStickerPack={onPressStickerPack}
                    />
                    <FloatingAction
                        actions={[{
                            text: "Create Sticker Pack",
                            name: "create_sticker_pack",
                            icon: require("../../../assets/icons/plus.png"),
                        }]}
                        overrideWithAction
                        onPressItem={onPressCreateStickerPack}
                    />
                </>
            ) : (
                isLoading ? (
                    <Layout style={tailwind("flex-1 justify-center items-center")}>
                        <Spinner size="giant" />
                    </Layout>
                ) : (
                    <NoStickerPacksScreen
                        onPressCreateStickerPack={onPressCreateStickerPack}
                        refreshing={isFetching}
                        onRefresh={refetch}
                    />
                )
            )}
        </SafeAreaView>
    );
};
