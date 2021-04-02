import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/AppNavigator";
import { useQueryClient } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { StickerPackRo } from "../../../api/generated-typescript-api-client/src";
import { HomeScreenHeader } from "../../../components/home/HomeScreenHeader";
import { StickerPacksList } from "../../../components/stickerpack/StickerPackList";
import { sortedStickerPacks } from "../../../util/sorting";
import { useOwnAndJoinedStickerPacks } from "../../../api/hooks/query/stickerPack";
import { storeImages } from "../../../util/image_storing";
import { registerStickerPacks } from "../../..//util/sticker_registration";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const { accessToken, logout } = React.useContext(AuthContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks);
    }, [accessToken]);

    const ownAndJoinedStickerPacksQuery = useOwnAndJoinedStickerPacks();

    useEffect(() => {
        // TODO: move this to a more valid location?
        if (ownAndJoinedStickerPacksQuery.data) {
            storeImages(ownAndJoinedStickerPacksQuery.data);
            registerStickerPacks(ownAndJoinedStickerPacksQuery.data);
        }
    }, [ownAndJoinedStickerPacksQuery.dataUpdatedAt]);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onCreateStickerPack={() => navigation.navigate("CreateStickerPackScreen")}
                onLogout={logout}
            />
            <StickerPacksList
                stickerPacks={sortedStickerPacks(ownAndJoinedStickerPacksQuery.data || [])}
                refreshing={ownAndJoinedStickerPacksQuery.isLoading}
                onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.ownAndJoinedStickerPacks)}
                onPressStickerPack={(stickerPack: StickerPackRo) => {
                    navigation.navigate("StickerPackDetailScreen", {
                        stickerPackId: stickerPack.id,
                    });
                }}
            />
        </SafeAreaView>
    );
};
