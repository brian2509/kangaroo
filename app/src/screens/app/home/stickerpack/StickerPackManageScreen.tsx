import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import { MemberList } from "../../../../components/sticker-pack-manage-screen/MemberList";
import tw from "tailwind-react-native-classnames";

type Props = StackScreenProps<HomeStackParamList, "StickerPackManageScreen">;
export const StickerPackManageScreen = ({ route }: Props): React.ReactElement => {
    const { stickerPack } = route.params;

    return (
        <SafeAreaView style={tw`flex h-full bg-white`}>
            <MemberList stickerPack={stickerPack} />
        </SafeAreaView>
    );
};
