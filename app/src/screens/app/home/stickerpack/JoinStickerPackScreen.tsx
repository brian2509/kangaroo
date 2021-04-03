import { StackScreenProps } from "@react-navigation/stack";
import { Button, Layout, Spinner } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "tailwind-rn";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { StickerPackRo, StickerRo } from "../../../../api/generated-typescript-api-client/src";
import { ScrollView } from "react-native-gesture-handler";
import { Text, Image } from "react-native";
import { useQueryClient } from "react-query";
import { useInviteMutation } from "../../../../api/hooks/mutations/invites";
import { useInvitePreview } from "../../../../api/hooks/query/invites";
import { QUERY_KEYS } from "../../../../constants/ReactQueryKeys";

type StickerPackProps = {
    stickerPack: StickerPackRo;
};

class AuthorStickersView extends React.Component<StickerPackProps> {
    renderSticker = (sticker: StickerRo): JSX.Element => {
        return (
            <Layout
                key={sticker.id}
                style={{
                    width: "21%",
                    height: "auto",
                    marginHorizontal: "2%",
                    marginBottom: "3.5%",
                }}>
                <Image
                    style={tw.style("rounded-lg", {
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 3,
                    })}
                    source={{
                        uri: sticker.fileUrl,
                    }}
                />
            </Layout>
        );
    };

    render() {
        return (
            <Layout style={tailwind("flex-col p-2 pt-1 pb-8")}>
                <Layout style={tailwind("flex-row flex-grow justify-between items-baseline")}>
                    <Text style={tailwind("font-semibold mr-4")}>
                        Willem Alexander
                        <Text style={tailwind("text-xs text-gray-500")}>
                            {" "}
                            ({this.props.stickerPack.stickers.length})
                        </Text>
                    </Text>
                    <Text style={tailwind("text-gray-500 pt-3 text-xs")}>Wed 4:20</Text>
                </Layout>
                <Layout style={tw`flex-row flex-wrap pt-3`}>
                    {this.props.stickerPack.stickers.map((sticker) => {
                        return this.renderSticker(sticker);
                    })}
                </Layout>
            </Layout>
        );
    }
}

interface BodyProps extends StickerPackProps {
    onJoinStickerPack: () => Promise<void>;
}
const Body = ({ stickerPack, onJoinStickerPack }: BodyProps) => {
    return (
        <ScrollView style={tailwind("p-4 pt-5")}>
            <Text style={tailwind("w-full text-center text-2xl font-bold py-4 pb-6")}>
                {stickerPack.name}
            </Text>
            <Layout style={tailwind("flex-row items-end items-baseline")}>
                <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                    {stickerPack.stickers.length}/30
                </Text>
            </Layout>
            <AuthorStickersView stickerPack={stickerPack} />
            <Button onPress={onJoinStickerPack}>Join!</Button>
        </ScrollView>
    );
};

type Props = StackScreenProps<HomeStackParamList, "JoinStickerPackScreen">;
export const JoinStickerPackScreen = ({ navigation, route }: Props): React.ReactElement => {
    const inviteId = route.params.inviteId;

    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries([QUERY_KEYS.invitePreview, inviteId]);
    }, [inviteId]);

    const { mutate: useInvite, error } = useInviteMutation(queryClient);

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
                    {error && error.message && <Text>{error.message}</Text>}
                </>
            )}
        </SafeAreaView>
    );
};
