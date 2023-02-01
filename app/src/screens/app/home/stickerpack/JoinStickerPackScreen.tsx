import { StackScreenProps } from "@react-navigation/stack";
import { Button, Layout, Spinner } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "tailwind-rn";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";
import tw from "tailwind-react-native-classnames";
import { StickerPackRo } from "../../../../api/generated-typescript-api-client/src";
import { useQueryClient } from "react-query";
import { useInviteMutation } from "../../../../api/hooks/mutations/invites";
import { useInvitePreview } from "../../../../api/hooks/query/invites";
import { QUERY_KEYS } from "../../../../constants/ReactQueryKeys";
import StickerPackBody from "../../../../components/stickerpack/StickerPackStickersBody";
import StickerPackHeader from "../../../../components/stickerpack/StickerPackHeader";

interface BodyProps {
    stickerPack: StickerPackRo;
    onJoinStickerPack: () => Promise<void>;
}

const Body = ({ stickerPack, onJoinStickerPack }: BodyProps) => {
    return (
        <Layout>
            <StickerPackHeader stickerPack={stickerPack} />
            <Layout style={tailwind("")}>
                <Button
                    style={tailwind("rounded-none")}
                    size="giant"
                    onPress={onJoinStickerPack}
                >
                    Join!
                </Button>
            </Layout>
            <StickerPackBody stickerPack={stickerPack} />
        </Layout>
    );
};

type Props = StackScreenProps<HomeStackParamList, "JoinStickerPackScreen">;
export const JoinStickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const inviteId = route.params.inviteId;

    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries([QUERY_KEYS.invitePreview, inviteId]);
    }, [inviteId]);

    const { mutate: useInvite } = useInviteMutation(queryClient);

    const { data } = useInvitePreview(queryClient, inviteId);

    const onJoinStickerPack = async () => {
        if (data == undefined) {
            return;
        }

        useInvite(inviteId, {
            onSuccess: () => {
                navigation.pop();
            },
        });
    };

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            {data == undefined ? (
                <Layout style={tw`flex-1 items-center mt-20`}>
                    <Spinner size="giant" />
                </Layout>
            ) : (
                <>
                    <Body stickerPack={data} onJoinStickerPack={onJoinStickerPack} />
                </>
            )}
        </SafeAreaView>
    );
};
