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
import { useStickerPacks } from "../../../api/hooks/query/stickerPack";
import { useRemoveStickerPackMutation } from "../../../api/hooks/mutations/stickerPack";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const { accessToken, logout } = React.useContext(AuthContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
    }, [accessToken]);

    const myStickerPacksQuery = useStickerPacks();

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onCreateStickerPack={() => navigation.navigate("CreateStickerPackScreen")}
                onLogout={logout}
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
        </SafeAreaView>
    );
};
