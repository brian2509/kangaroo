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
import {
    CreateStickerPackDto,
    StickerPackRo,
} from "../../../api/generated-typescript-api-client/src";
import { HomeScreenHeader } from "../../../components/home/HomeScreenHeader";
import { StickerPacksList } from "../../../components/stickerpack/StickerPackList";
import { generateName } from "../../../util/placeholder_generation";

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

    const createStickerPackMutation = useMutation(
        async (createStickerPackDto: CreateStickerPackDto) =>
            (await api.stickerPacks.create(createStickerPackDto)).data,
        {
            onSuccess: (data) => {
                if (myStickerPacksQuery.data) {
                    queryClient.setQueryData(QUERY_KEYS.myStickerPacks, [
                        ...myStickerPacksQuery.data,
                        data,
                    ]);
                }
                () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks);
            },
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
                onCreateStickerPack={() =>
                    createStickerPackMutation.mutate({
                        name: generateName(),
                        personal: true,
                        animated: false,
                    })
                }
                onLogout={logout}
            />
            <StickerPacksList
                stickerPacks={myStickerPacksQuery.data}
                refreshing={
                    myStickerPacksQuery.isLoading ||
                    createStickerPackMutation.isLoading ||
                    removeStickerPackMutation.isLoading
                }
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
