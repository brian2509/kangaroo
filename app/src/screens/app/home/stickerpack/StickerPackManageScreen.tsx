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

type Props = StackScreenProps<HomeStackParamList, "StickerPackManageScreen">;
export const StickerPackManageScreen = ({ navigation }: Props): React.ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [clickedMember, setClickedMember] = useState<string>("loading");

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

    const renderItem = ({ item }: { item: any }) => (
        <ListItem
            onPress={() => {
                setVisible(true);
                setClickedMember(item.title);
            }}
            title={`${item.title}`}
            description={`${item.description}`}
            accessoryLeft={(props) => <Icon {...props} name="person" />}
            accessoryRight={() => <Text style={tw`text-gray-500 text-xs pr-3`}>Admin</Text>}
        />
    );

    const data = [
        {
            title: "Willem Alexander",
            description: "3 Stickers",
        },
        {
            title: "Rowdy Planje",
            description: "5 Stickers",
        },
        {
            title: "Mika Brie",
            description: "2 Stickers",
        },
    ];

    return (
        <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
            <List data={data} ItemSeparatorComponent={Divider} renderItem={renderItem} />
            <Modal
                visible={visible}
                style={tw`w-60`}
                backdropStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onBackdropPress={() => setVisible(false)}>
                <Card
                    disabled={true}
                    header={() => (
                        <Text style={tw`p-3 text-xs text-gray-500 text-center`}>
                            {clickedMember}
                        </Text>
                    )}
                    footer={() => (
                        <Button size="medium" appearance="ghost" onPress={() => setVisible(false)}>
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
