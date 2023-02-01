import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import { MemberList } from "../../../../components/sticker-pack-manage-screen/MemberList";
import tw from "tailwind-react-native-classnames";
import { Button, Icon, Layout } from "@ui-kitten/components";
import tailwind from "tailwind-rn";
import { useKickMemberMutation, useRemoveStickerPackMutation } from "../../../../api/hooks/mutations/stickerPack";
import { useQueryClient } from "react-query";
import { showConfirmModal } from "../../../../components/common/ConfirmModal";
import { UserRo } from "../../../../api/generated-typescript-api-client/src";
import { MemberClickedModal } from "../../../../components/sticker-pack-manage-screen/MemberClickedModal";
import { useStickerPack } from "../../../../api/hooks/query/stickerPack";

type Props = StackScreenProps<HomeStackParamList, "StickerPackManageScreen">;
export const StickerPackManageScreen = ({ navigation, route }: Props): React.ReactElement => {
    const { stickerPackId } = route.params;

    const [clickedMember, setClickedMember] = useState<UserRo | undefined>();

    const { data: stickerPack } = useStickerPack(stickerPackId);

    const queryClient = useQueryClient();
    const { mutate: deleteStickerPack } = useRemoveStickerPackMutation(queryClient);
    const { mutate: kickMember } = useKickMemberMutation(queryClient);

    const onPressKickMember = (user: UserRo) => {
        const onPressConfirm = async () => {
            await kickMember(
                {
                    stickerPackId,
                    userToBeKickedId: user.id,
                },
                {
                    onSuccess: () => {
                        setClickedMember(undefined);
                    }
                }
            );
        }

        showConfirmModal({
            message: "Are you sure?",
            buttonText: "Kick " + user.username,
            status: "danger",
            onPressConfirm,
        });
    }

    const onPressDeleteStickerPack = async () => {
        const onPressConfirm = async () => {
            await deleteStickerPack(stickerPackId);
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
            {stickerPack ? (
                <MemberList
                    stickerPack={stickerPack}
                    onPressMember={setClickedMember}
                />
            ) : null}
            {clickedMember && (
                <MemberClickedModal
                    selectedMember={clickedMember}
                    modalVisible={clickedMember !== undefined}
                    closeModal={() => {
                        setClickedMember(undefined);
                    }}
                    onPressKickMember={() => {
                        onPressKickMember(clickedMember);
                    }}
                />
            )}
        </SafeAreaView>
    );
};
