import { StackScreenProps } from "@react-navigation/stack";
import { Divider, Icon, Layout, List, ListItem } from "@ui-kitten/components";
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

    renderItemAccessory = (): JSX.Element => (
        <Text style={tw`text-gray-500 text-xs pr-3`}>Admin</Text>
    );

    renderItemIcon = (props) => <Icon {...props} name="person" />;

    renderItem = ({ item, index }) => (
        <ListItem
            title={`${item.title}`}
            description={`${item.description}`}
            accessoryLeft={this.renderItemIcon}
            accessoryRight={this.renderItemAccessory}
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
                <List
                    //   style={styles.container}
                    data={data}
                    ItemSeparatorComponent={Divider}
                    renderItem={this.renderItem}
                />
            </SafeAreaView>
        );
    }
}
