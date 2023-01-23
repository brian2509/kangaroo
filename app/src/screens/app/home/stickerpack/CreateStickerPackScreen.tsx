import { StackScreenProps } from "@react-navigation/stack";
import { Button, CheckBox, Icon, IconProps, Input, Layout, Spinner, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Keyboard, SafeAreaView } from "react-native";
import { useQueryClient } from "react-query";
import tailwind from "tailwind-rn";
import validate from "validate.js";
import { useCreateStickerPackMutation } from "../../../../api/hooks/mutations/stickerPack";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";

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
    const [stickerPackAnimated, setStickerPackAnimated] = useState(false);

    const inputValidation = validate.validate({ name: stickerPackName }, constraints);
    const isNameValid = inputValidation !== undefined ? !inputValidation["name"] : true;

    const queryClient = useQueryClient();

    const { mutate: createStickerPackMutation, isLoading } = useCreateStickerPackMutation(queryClient);
    const createStickerPack = () => {
        if (!isNameValid) return;

        const dto = {
            name: stickerPackName,
            personal: false,
            animated: stickerPackAnimated,
        };

        createStickerPackMutation(dto, {
            onSuccess: (data) => {
                navigation.replace("StickerPackScreen", {
                    stickerPack: data,
                });
            },
        });
    };

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
                        checked={stickerPackAnimated}
                        onChange={setStickerPackAnimated}>
                        {() => <Text style={tailwind("mx-3 text-xs text-gray-400")}>Animated</Text>}
                    </CheckBox>
                    <Button
                        style={tailwind("p-0 pl-2 pr-2")}
                        onPress={createStickerPack}
                        disabled={isLoading}
                        accessoryLeft={() => (isLoading ? <Spinner size="small" status="basic" /> : <></>)}
                    >
                        Create Pack
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
