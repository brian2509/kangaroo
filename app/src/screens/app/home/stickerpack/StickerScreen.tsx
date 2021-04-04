import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon, Layout } from "@ui-kitten/components";
import React from "react";
import { Image, SafeAreaView } from "react-native";
import { useQueryClient } from "react-query";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { useDeleteStickerMutation } from "../../../../api/hooks/mutations/stickerPack";

type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
export const StickerScreen = ({ navigation, route }: Props) => {
    const { sticker, stickerPack } = route.params;

    const queryClient = useQueryClient();

    const { mutate: deleteSticker } = useDeleteStickerMutation(queryClient);

    const onDeleteSticker = () => {
        if (stickerPack == undefined) {
            return;
        }

        const deleteInfo = {
            stickerPackId: stickerPack.id,
            stickerId: sticker.id,
        };

        deleteSticker(deleteInfo, {
            onSuccess: () => {
                navigation.pop();
            },
        });
    };

    navigation.setOptions({
        headerTitle: "Sticker",
        headerRight: function headerRight() {
            return (
                <Layout style={tw`flex-row mr-4`}>
                    {stickerPack && (
                        <Button
                            appearance="ghost"
                            onPress={onDeleteSticker}
                            accessoryLeft={() => (
                                <Icon name="trash-2-outline" fill="black" width={25} height={25} />
                            )}
                        />
                    )}
                </Layout>
            );
        },
    });

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
};
