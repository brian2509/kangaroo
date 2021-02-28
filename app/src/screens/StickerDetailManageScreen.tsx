import { StackScreenProps } from "@react-navigation/stack";
import { Button, Card, Divider, Icon, Layout, List, ListItem, Modal } from "@ui-kitten/components";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { StickerPack } from "src/api/apiTypes";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";

type Props = StackScreenProps<HomeStackParamList, "StickerDetailManageScreen">;
export class StickerDetailManageScreen extends React.Component<Props> {
    private stickerPack: StickerPack;

    constructor(props: Props) {
        super(props);
        this.stickerPack = props.route.params.stickerPack;
        this.state = {
            visible: false,
        };
    }

    setVisible(state: boolean): void {
        this.setState({ visible: state });
    }

    componentDidMount(): void {
        this.props.navigation.setOptions({
            // headerTitle: this.stickerPack.name,
            headerRight: () => (
                <Layout style={tw`flex-row mr-4`}>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text>Share</Text>
                    </TouchableOpacity>
                </Layout>
            ),
        });
    }

    renderItem = ({ item, index }) => (
        <ListItem
            onPress={() => this.setVisible(true)}
            title={`${item.title}`}
            description={`${item.description}`}
            accessoryLeft={(props) => <Icon {...props} name="person" />}
            accessoryRight={() => <Text style={tw`text-gray-500 text-xs pr-3`}>Admin</Text>}
        />
    );

    render(): JSX.Element {
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
                <List data={data} ItemSeparatorComponent={Divider} renderItem={this.renderItem} />
                <Modal
                    visible={this.state.visible}
                    backdropStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onBackdropPress={() => this.setVisible(false)}>
                    <Card disabled={true}>
                        <Text>Welcome to UI Kitten 😻</Text>
                        <Button onPress={() => this.setVisible(false)}>DISMISS</Button>
                    </Card>
                </Modal>
            </SafeAreaView>
        );
    }
}
