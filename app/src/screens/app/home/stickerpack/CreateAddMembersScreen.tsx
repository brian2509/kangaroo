import { StackScreenProps } from "@react-navigation/stack";
import { Button, Icon, IconProps, Input, Layout, Text } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { Keyboard, SafeAreaView } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import tailwind from "tailwind-rn";
import { CreateStickerPackDto } from "../../../../api/generated-typescript-api-client/src";
import { api } from "../../../../api/generatedApiWrapper";
import { QUERY_KEYS } from "../../../../constants/ReactQueryKeys";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import { logErrorResponse } from "../../../../util/logging";
import tw from "tailwind-react-native-classnames";
import Clipboard from "@react-native-clipboard/clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AccountProfileImage } from "../../../../components/common/AccountProfileImage";
import { TextFieldActions } from "../../../../components/common/TextFieldActions";

type Props = StackScreenProps<HomeStackParamList, "CreateAddMembersScreen">;
export const CreateAddMembersScreen = ({ route, navigation }: Props): React.ReactElement => {
    const exportUrlPlaceholder = "http://kangaroo.nl/user/123123/placeholder";
    const queryClient = useQueryClient();
    const [copied, setCopied] = React.useState(false);
    const [addUser, setAddUser] = React.useState("");

    const createStickerPackMutation = useMutation(
        async (createStickerPackDto: CreateStickerPackDto) =>
            (await api.stickerPacks.create(createStickerPackDto)).data,
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.myStickerPacks),
            onError: logErrorResponse,
        },
    );

    const createStickerPack = () => {
        createStickerPackMutation.mutate(
            {
                name: route.params.name,
                personal: route.params.personal,
                animated: false,
            },
            {
                onSuccess: (data) => {
                    navigation.replace("StickerPackDetailScreen", {
                        stickerPack: data,
                    });
                },
            },
        );
    };

    const copyIcon = (props: IconProps) => (
        <TouchableOpacity
            onPress={() => {
                setCopied(true);
                Clipboard.setString(exportUrlPlaceholder);
            }}>
            <Icon {...props} name={"file-outline"} />
        </TouchableOpacity>
    );

    useEffect(() => {
        navigation.setOptions({
            headerTitle: function showHeader() {
                return (
                    <Text style={tw`font-semibold text-lg`} numberOfLines={1}>
                        {
                            // eslint-disable-next-line react/prop-types
                            route.params.name
                        }
                    </Text>
                );
            },
        });
    }, []);

    return (
        <SafeAreaView style={tailwind("h-full bg-white")}>
            <Layout style={tw`flex-col flex-grow`}>
                <AccountProfileImage></AccountProfileImage>
                <Layout style={tw`p-6`}>
                    <Text style={tw`font-semibold text-4xl pl-2 mb-4`}>Add Members</Text>
                    <Input
                        // disabled={true}
                        style={tw`w-full mb-4 bg-white`}
                        size="medium"
                        accessoryRight={copyIcon}
                        onEndEditing={() => Keyboard.dismiss()}
                        caption={copied ? "Link copied to your clipboard!" : ""}
                        label={() => (
                            <Text style={tw`text-xs font-semibold pb-1 pl-3`}>
                                Copy your Invite Link
                            </Text>
                        )}
                        value={exportUrlPlaceholder}
                    />

                    <Input
                        // disabled={true}
                        style={tw`w-full mt-2 bg-white`}
                        size="medium"
                        value={addUser}
                        onEndEditing={() => Keyboard.dismiss()}
                        onChangeText={setAddUser}
                        accessoryRight={() => (
                            <Button size="small" style={tw`py-0`}>
                                Add
                            </Button>
                        )}
                        label={() => (
                            <Text style={tw`text-xs font-semibold pb-1 pl-3`}>
                                Add Kangaroo User
                            </Text>
                        )}
                        placeholder="Kangaroo Username"
                    />
                    <TextFieldActions
                        cancelTitle="Change Name"
                        doneTitle="Create"
                        onCancelPress={() => navigation.pop()}
                        onDonePress={createStickerPack}></TextFieldActions>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
