import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
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

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const { accessToken, logout } = React.useContext(AuthContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
    }, [accessToken]);

    const myStickerPacksQuery = useStickerPacks();

    useEffect(() => {
        // TODO: move this to a more valid location?
        if (myStickerPacksQuery.data) {
            storeImages(myStickerPacksQuery.data);
            registerStickerPacks(myStickerPacksQuery.data);
        }
    }, [myStickerPacksQuery.dataUpdatedAt]);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onPressProfile={() => {
                    navigation.navigate("SettingsScreen")
                }}
            />
            <StickerPacksList
                stickerPacks={sortedStickerPacks(myStickerPacksQuery.data || [])}
                refreshing={myStickerPacksQuery.isLoading}
                onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}
                onPressStickerPack={(stickerPack: StickerPackRo) => {
                    navigation.navigate("StickerPackDetailScreen", {
                        stickerPack,
                    });
                }}
            />
            <FloatingAction
                actions={[{
                    text: "Create Sticker Pack",
                    name: "bt_accessibility",
                    icon: require("../../../assets/icons/plus.jpg"),
                }]}
                overrideWithAction
                onPressItem={() => {
                    navigation.navigate("CreateStickerPackScreen")
                }}
            />
        </SafeAreaView>
    );
};
