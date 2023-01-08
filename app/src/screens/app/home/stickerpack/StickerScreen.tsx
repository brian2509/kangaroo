import React, { useEffect } from "react";

import { StackScreenProps } from "@react-navigation/stack";
import { Icon, Layout } from "@ui-kitten/components";
import { Image, SafeAreaView, TouchableOpacity } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tw from "tailwind-react-native-classnames";

const DownloadIcon = () => {
    <Layout style={tw`flex-row mr-4`}>
        <TouchableOpacity activeOpacity={0.7}>
            <Icon name="download" fill="black" width={25} height={25} />
        </TouchableOpacity>
    </Layout>
}

type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
const StickerScreen = ({ route, navigation }: Props): JSX.Element => {
    const sticker = route.params.sticker;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Sticker",
            headerRight: DownloadIcon
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
