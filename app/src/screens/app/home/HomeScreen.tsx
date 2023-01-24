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
import { Button, Layout, Spinner, Text } from "@ui-kitten/components";

type Props = StackScreenProps<HomeStackParamList, "Homescreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    const queryClient = useQueryClient();

    const { data: myStickerPacks, isLoading, dataUpdatedAt } = useStickerPacks();

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

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <HomeScreenHeader
                onPressProfile={() => {
                    navigation.navigate("SettingsScreen")
                }}
            />
            {isLoading ? (
                <Layout style={tailwind("flex-1 w-full h-full justify-center items-center")}>
                    <Spinner size="giant" />
                </Layout>
            ) : (
                (myStickerPacks !== undefined && myStickerPacks.length > 0) ? (
                    <>
                        <StickerPacksList
                            stickerPacks={sortedStickerPacks(myStickerPacks)}
                            refreshing={isLoading}
                            onRefresh={() => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks)}
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
                            onPressItem={onPressCreateStickerPack}
                        />
                    </>
                ) : (
                    <Layout style={tailwind("flex-1 w-full h-full justify-center items-center p-8 text-center")}>
                        <Layout>
                            <Text
                                style={tailwind("mb-4 text-4xl tracking-tight font-bold text-gray-900 text-center")}
                            >
                                No sticker packs
                            </Text>
                            <Text style={tailwind("mb-6 font-light text-gray-500 text-lg text-center")}>
                                Create your first sticker pack!
                            </Text>
                        </Layout>
                        <Button
                            style={tailwind("font-medium rounded-lg text-sm text-sm px-5 py-2.5 mr-2 mb-2")} size="medium"
                            onPress={onPressCreateStickerPack}
                        >
                            Create new Sticker Pack
                        </Button>
                    </Layout>
                )
            )}
        </SafeAreaView>
    );
};
