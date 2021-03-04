import { StackScreenProps } from "@react-navigation/stack";
import { Button, CheckBox, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "tailwind-rn";
import { HomeStackParamList } from "../../navigation/AppNavigator";

type Props = StackScreenProps<HomeStackParamList, "CreateStickerPackScreen">;
export const CreateStickerPackScreen = ({ navigation }: Props): React.ReactElement => {
    const [stickerPackName, setStickerPackName] = useState("");
    const [stickerPackPrivate, setStickerPackPrivate] = useState(false);

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            <Layout style={tailwind("flex-col p-8")}>
                <Layout style={tailwind("bg-gray-100 rounded-lg mt-4 p-4")}>
                    <Input
                        style={tailwind("w-full py-3 rounded-lg")}
                        size="large"
                        label="Sticker pack name"
                        placeholder="Name"
                        value={stickerPackName}
                        onChangeText={setStickerPackName}></Input>
                    <CheckBox
                        style={tailwind("w-full py-3 px-0.5 rounded-lg")}
                        checked={stickerPackPrivate}
                        onChange={setStickerPackPrivate}>
                        {() => <Text style={tailwind("mx-3 text-base")}>Private</Text>}
                    </CheckBox>
                </Layout>
                <Button
                    style={tailwind("pl-10 pr-10 my-10")}
                    onPress={() => {
                        console.log({ stickerPackName, stickerPackPrivate });
                        navigation.pop();
                    }}>
                    Create!
                </Button>
            </Layout>
        </SafeAreaView>
    );
};
