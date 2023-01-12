import React, { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon } from "@ui-kitten/components";
import { Image, SafeAreaView } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tw from "tailwind-react-native-classnames";
import tailwind from "tailwind-rn";
import { useDeleteStickerMutation } from "../../../../api/hooks/mutations/stickerPack";
import { useQueryClient } from "react-query";


type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
const StickerScreen = ({ route, navigation }: Props): JSX.Element => {
    const { stickerPack, sticker, allowDeleteSticker } = route.params;

    const queryClient = useQueryClient();
    const { mutate: deleteSticker } = useDeleteStickerMutation(queryClient);

    const onPressDeleteSticker = async () => {
        await deleteSticker({
            stickerPackId: stickerPack.id,
            stickerId: sticker.id,
        })

        navigation.pop();
    }

    const DeleteIcon = () => (
        <Button
            appearance="ghost"
            status="danger"
            style={tailwind("mx-3 px-1")}
            onPress={onPressDeleteSticker}
            accessoryLeft={(props) => (<Icon style={tw.style("w-8 h-8")} name="trash" {...props} />)}
        />
    );

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Sticker",
            headerRight: allowDeleteSticker ? DeleteIcon : undefined,
        });
    }, [])

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <Image
                style={tw.style("rounded-lg w-full", {
                    paddingBottom: "100%",
                })}
                source={{ uri: sticker.fileUrl }}
            />
        </SafeAreaView>
    );
}

export default StickerScreen;
