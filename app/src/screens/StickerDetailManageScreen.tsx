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
import React from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
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
            clickedMember: "loading",
        };
    }

    setVisible(visible: boolean): void {
        this.setState({ ...this.state, visible });
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

    renderItem = ({ item }) => (
        <ListItem
            onPress={() => {
                this.setState({ visible: true, member: item.title });
            }}
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
                    style={tw`w-60`}
                    backdropStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onBackdropPress={() => this.setVisible(false)}>
                    <Card
                        disabled={true}
                        header={() => (
                            <Text
                                style={tw.style("p-3 text-xs text-gray-500", {
                                    textAlign: "center",
                                })}>
                                {this.state.member}
                            </Text>
                        )}
                        footer={() => (
                            <Button
                                size="medium"
                                appearance="ghost"
                                onPress={() => this.setVisible(false)}>
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
    }
}
