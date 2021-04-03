import { StackScreenProps } from "@react-navigation/stack";
import {
    Text,
    Button,
    Card,
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    Modal,
} from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { UserRo } from "../../../../api/generated-typescript-api-client/src";
import { fullMemberList, isAuthor } from "../../../../util/stickerpack_utils";

type Props = StackScreenProps<HomeStackParamList, "StickerPackManageScreen">;
export const StickerPackManageScreen = ({ navigation, route }: Props): React.ReactElement => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [clickedMember, setClickedMember] = useState<UserRo | undefined>();

    const { stickerPack } = route.params;

    const HeaderRight = () => (
        <Layout style={tw`flex-row mr-4`}>
            <TouchableOpacity activeOpacity={0.7}>
                <Text>Share</Text>
            </TouchableOpacity>
        </Layout>
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRight,
        });
    }, []);

    const renderItem = ({ item }: { item: UserRo }) => (
        <ListItem
            onPress={() => {
                setClickedMember(item);
                setModalVisible(true);
            }}
            title={`${item.username}`}
            description={`# stickers`}
            // description={item.id}
            accessoryLeft={(props) => <Icon {...props} name="person" />}
            accessoryRight={() => {
                if (!isAuthor(stickerPack, item)) {
                    return <></>;
                }

                return <Text style={tw`text-gray-500 text-xs pr-3`}>Author</Text>;
            }}
        />
    );

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <List
                data={fullMemberList(stickerPack)}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
            />
            <Modal
                visible={modalVisible}
                style={tw`w-60`}
                backdropStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onBackdropPress={() => setModalVisible(false)}>
                <Card
                    disabled={true}
                    header={() => (
                        <Text style={tw`p-3 text-xs text-gray-500 text-center`}>
                            {clickedMember?.username}
                        </Text>
                    )}
                    footer={() => (
                        <Button
                            size="medium"
                            appearance="ghost"
                            onPress={() => setModalVisible(false)}>
                            Close
                        </Button>
                    )}>
                    <Button size="medium" appearance="ghost" status="basic">
                        Show Account
                    </Button>
                    <Button size="medium" appearance="ghost" status="basic">
                        Remove as Admin
                    </Button>
                    <Button status="danger" size="medium" appearance="ghost">
                        Remove from Pack
                    </Button>
                </Card>
            </Modal>
        </SafeAreaView>
    );
};
