import { StackScreenProps } from "@react-navigation/stack";
import { Button, CheckBox, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "react-query";
import tailwind from "tailwind-rn";
import { CreateStickerPackDto } from "../../../../api/generated-typescript-api-client/src";
import { api } from "../../../../api/generatedApiWrapper";
import { QUERY_KEYS } from "../../../../constants/ReactQueryKeys";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import { logErrorResponse } from "../../../../util/logging";

type Props = StackScreenProps<HomeStackParamList, "CreateStickerPackScreen">;
export const CreateStickerPackScreen = ({ navigation }: Props): React.ReactElement => {
    const [stickerPackName, setStickerPackName] = useState("");
    const [stickerPackPrivate, setStickerPackPrivate] = useState(false);

    const queryClient = useQueryClient();

    const createStickerPackMutation = useMutation(
        async (createStickerPackDto: CreateStickerPackDto) =>
            (await api.stickerPacks.create(createStickerPackDto)).data,
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
            onError: logErrorResponse,
        },
    );

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            <Layout style={tailwind("flex-col p-8")}>
                <Input
                    size="large"
                    label="Sticker pack name"
                    placeholder="Name"
                    value={stickerPackName}
                    autoFocus={true}
                    onEndEditing={() => Keyboard.dismiss()}
                    onChangeText={setStickerPackName}></Input>
                <Layout style={tailwind("flex-row justify-between my-3")}>
                    <CheckBox
                        style={tailwind("ml-3 flex-grow")}
                        checked={stickerPackPrivate}
                        onChange={setStickerPackPrivate}>
                        {() => <Text style={tailwind("mx-3 text-sm text-gray-400")}>Private</Text>}
                    </CheckBox>
                    <Button
                        style={tailwind("px-6")}
                        onPress={() => {
                            createStickerPackMutation.mutate(
                                {
                                    name: stickerPackName,
                                    personal: stickerPackPrivate,
                                    animated: false,
                                },
                                {
                                    onSuccess: () => navigation.pop(),
                                },
                            );
                        }}>
                        Create!
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
