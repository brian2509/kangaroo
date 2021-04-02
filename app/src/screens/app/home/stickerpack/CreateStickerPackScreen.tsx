import { StackScreenProps } from "@react-navigation/stack";
import { Button, CheckBox, Icon, IconProps, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Keyboard, SafeAreaView } from "react-native";
import tailwind from "tailwind-rn";
import validate from "validate.js";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";

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
    const [stickerPackAnimated, setStickerPackAnimated] = useState(false);

    const inputValidation = validate.validate({ name: stickerPackName }, constraints);
    const isNameValid = inputValidation !== undefined ? !inputValidation["name"] : true;

    return (
        <SafeAreaView style={tailwind("h-full bg-white p-0")}>
            <Layout style={tailwind("flex-1 flex-col p-6 mt-0")}>
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
                <Layout style={tailwind("flex-col")}>
                    <CheckBox
                        style={tailwind("my-3")}
                        checked={stickerPackAnimated}
                        onChange={setStickerPackAnimated}>
                        {() => <Text style={tailwind("mx-3 text-xs text-gray-400")}>Animated</Text>}
                    </CheckBox>
                    <CheckBox
                        style={tailwind("mb-3")}
                        checked={stickerPackPrivate}
                        onChange={setStickerPackPrivate}>
                        {() => <Text style={tailwind("mx-3 text-xs text-gray-400")}>Private</Text>}
                    </CheckBox>
                </Layout>
                <Layout style={tailwind("flex-1 justify-end")}>
                    <Button
                        style={tailwind("p-0 pl-2 pr-2")}
                        onPress={() => {
                            if (isNameValid) {
                                navigation.navigate("CreateAddMembersScreen", {
                                    name: stickerPackName,
                                    personal: stickerPackPrivate,
                                    animated: stickerPackAnimated,
                                });
                            }
                        }}>
                        Next
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
