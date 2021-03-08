import { StackScreenProps } from "@react-navigation/stack";
import { Button, CheckBox, Icon, IconProps, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Keyboard, SafeAreaView } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import tailwind from "tailwind-rn";
import validate from "validate.js";
import { CreateStickerPackDto } from "../../../../api/generated-typescript-api-client/src";
import { api } from "../../../../api/generatedApiWrapper";
import { QUERY_KEYS } from "../../../../constants/ReactQueryKeys";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import { logErrorResponse } from "../../../../util/logging";

const AlertIcon = (props: IconProps) => <Icon {...props} name="alert-circle-outline" />;

const constraints = {
    name: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 30,
            message: "must at least contain 1 and at most 30 characters",
        },
        format: {
            pattern: "[a-zA-Z0-9._ ]*",
            message: "contains illegal characters",
        },
    },
};

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

    const inputValidation = validate.validate({ name: stickerPackName }, constraints);
    const isNameValid = inputValidation !== undefined ? !inputValidation["name"] : true;

    return (
        <SafeAreaView style={tailwind("h-full bg-white p-0")}>
            <Layout style={tailwind("flex-col p-6 mt-0")}>
                <Input
                    size="medium"
                    label="Sticker Pack Name"
                    placeholder="Name"
                    value={stickerPackName}
                    autoFocus={true}
                    caption={
                        !isNameValid && inputValidation !== undefined && inputValidation["name"][0]
                    }
                    status={!isNameValid ? "danger" : "basic"}
                    captionIcon={!isNameValid ? AlertIcon : undefined}
                    onEndEditing={() => Keyboard.dismiss()}
                    onChangeText={setStickerPackName}
                />
                <Layout style={tailwind("flex-row justify-between my-3")}>
                    <CheckBox
                        style={tailwind("ml-3")}
                        checked={stickerPackPrivate}
                        onChange={setStickerPackPrivate}>
                        {() => <Text style={tailwind("mx-3 text-xs text-gray-400")}>Private</Text>}
                    </CheckBox>
                    <Button
                        style={tailwind("p-0 pl-2 pr-2")}
                        onPress={() => {
                            if (isNameValid) {
                                createStickerPackMutation.mutate(
                                    {
                                        name: stickerPackName,
                                        personal: stickerPackPrivate,
                                        animated: false,
                                    },
                                    {
                                        onSuccess: (data) => {
                                            navigation.replace("StickerPackDetailScreen", {
                                                stickerPack: data,
                                            });
                                        },
                                    },
                                );
                            }
                        }}>
                        Create
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
