import React, { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import { MemberList } from "../../../../components/sticker-pack-manage-screen/MemberList";
import tw from "tailwind-react-native-classnames";
import { Button, Icon, Layout } from "@ui-kitten/components";
import tailwind from "tailwind-rn";
import { useRemoveStickerPackMutation } from "../../../../api/hooks/mutations/stickerPack";
import { useQueryClient } from "react-query";
import { showConfirmModal } from "../../../../components/common/ConfirmModal";

type Props = StackScreenProps<HomeStackParamList, "StickerPackManageScreen">;
export const StickerPackManageScreen = ({ navigation, route }: Props): React.ReactElement => {
    const { stickerPack } = route.params;

    const queryClient = useQueryClient();
    const { mutate: deleteStickerPack } = useRemoveStickerPackMutation(queryClient);

    const onPressDeleteStickerPack = async () => {
        if (!stickerPack) return;

        const onPressConfirm = async () => {
            await deleteStickerPack(stickerPack.id);
            navigation.popToTop();
        }

        showConfirmModal({
            message: "Are you sure?",
            buttonText: "Delete Sticker Pack",
            status: "danger",
            onPressConfirm,
        });
    }

    const HeaderRight = () => (
        <Layout style={tw`flex-row mr-4`}>
            <Button
                disabled={stickerPack == undefined}
                appearance="ghost"
                status="danger"
                style={tailwind("px-0")}
                onPress={onPressDeleteStickerPack}
                accessoryLeft={(props) => (<Icon name="trash" {...props} />)}
            />
        </Layout>
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRight,
        });
    }, [stickerPack]);

    return (
        <SafeAreaView style={tw`flex h-full bg-white`}>
            <MemberList stickerPack={stickerPack} />
        </SafeAreaView>
    );
};
