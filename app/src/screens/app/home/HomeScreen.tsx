import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/AppNavigator";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../../util/logging";
import { api } from "../../../api/generatedApiWrapper";
import { StickerPackRo } from "../../../api/generated-typescript-api-client/src";
import { HomeScreenHeader } from "../../../components/home/HomeScreenHeader";
import { StickerPacksList } from "../../../components/stickerpack/StickerPackList";
import { sortedStickerPacks } from "../../../util/sorting";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const { accessToken, logout } = React.useContext(AuthContext);

    const queryClient = useQueryClient();

    useEffect(() => {
        () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
    }, [accessToken]);

    const myStickerPacksQuery = useQuery(
        QUERY_KEYS.myStickerPacks,
        async () => (await api.users.getOwnStickerPacks()).data,
        {
            onError: logErrorResponse,
        },
    );

    const removeStickerPackMutation = useMutation(
        async (stickerPackId: string) => (await api.stickerPacks.remove(stickerPackId)).data,
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
            onError: logErrorResponse,
        },
    );

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onCreateStickerPack={() => navigation.navigate("CreateStickerPackScreen")}
                onLogout={logout}
            />
            <StickerPacksList
                stickerPacks={sortedStickerPacks(myStickerPacksQuery.data || [])}
                refreshing={myStickerPacksQuery.isLoading || removeStickerPackMutation.isLoading}
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
