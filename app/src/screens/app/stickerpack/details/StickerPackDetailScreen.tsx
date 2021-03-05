import { Icon, Layout, Text } from "@ui-kitten/components";
import {
    Image,
    ImageStyle,
    SafeAreaView,
    ScrollView,
    StyleProp,
    TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../../navigation/AppNavigator";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import React from "react";
import { StickerPackRo, StickerRo } from "../../../../api/generated-typescript-api-client/src";
import { CoverStickerImage } from "../../../../common/CoverStickerImage";

type StickerPackProps = {
    stickerPack: StickerPackRo;
    onStickerPress?: (sticker: StickerRo) => void;
};

class AuthorStickersView extends React.Component<StickerPackProps> {
    renderSticker = (sticker: StickerRo): JSX.Element => {
        return (
            <TouchableOpacity
                key={sticker.id}
                style={{
                    width: "21%",
                    height: "auto",
                    marginHorizontal: "2%",
                    marginBottom: "3.5%",
                }}
                onPress={() => {
                    if (this.props.onStickerPress) {
                        this.props.onStickerPress(sticker);
                    }
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
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <Layout style={tailwind("flex-col p-2 pt-1")}>
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

class Body extends React.Component<StickerPackProps> {
    render() {
        return (
            <ScrollView style={tailwind("p-4 pt-3")}>
                <Layout style={tailwind("flex-row items-end items-baseline")}>
                    <Text style={tailwind("text-xl font-semibold mr-4")}>Stickers</Text>
                    <Text style={tailwind("text-gray-500 h-full pt-3 text-sm")}>
                        {this.props.stickerPack.stickers.length}/30
                    </Text>
                </Layout>
                <AuthorStickersView
                    stickerPack={this.props.stickerPack}
                    onStickerPress={this.props.onStickerPress}
                />
            </ScrollView>
        );
    }
}

class ToolBar extends React.Component<StickerPackProps> {
    render() {
        return (
            <Layout style={tailwind("flex-col p-4 pt-2 pb-2 border-b-2 border-t border-gray-300")}>
                <Layout style={tailwind("flex-row justify-between w-1/3 pb-1")}>
                    <Icon name="heart-outline" fill="gray" width={25} height={25} />
                    <Icon name="paper-plane-outline" fill="gray" width={25} height={25} />
                    <Icon name="upload" fill="gray" width={25} height={25} />
                </Layout>
                <Layout style={tailwind("flex-row pt-1")}>
                    <Text
                        style={tw`text-xs font-semibold`}>{`${this.props.stickerPack.views} Views`}</Text>
                    <Text
                        style={tw`text-xs pl-3 font-semibold`}>{`${this.props.stickerPack.likes} Likes`}</Text>
                    <Text
                        style={tw`text-xs pl-3 font-semibold`}>{`${this.props.stickerPack.likes} Followers`}</Text>
                </Layout>
            </Layout>
        );
    }
}

type Props = StackScreenProps<HomeStackParamList, "StickerPackDetailScreen">;
export class StickerDetailScreen extends React.Component<Props> {
    private stickerPack: StickerPackRo;

    constructor(props: Props) {
        super(props);
        this.stickerPack = props.route.params.stickerPack;
        this.onStickerPress = this.onStickerPress.bind(this);
    }

    onStickerPress(data: StickerRo): void {
        this.props.navigation.navigate("StickerScreen", { sticker: data });
    }

    componentDidMount(): void {
        this.props.navigation.setOptions({
            headerTitle: () => (
                <Layout style={tw`flex-row left-0`}>
                    <CoverStickerImage 
                        stickerPack={this.stickerPack} 
                        style={tw.style("w-9 h-9 mr-3 rounded-full")} 
                        onStickerPress={this.onStickerPress} />
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate("StickerPackManageScreen", {
                                stickerPack: this.stickerPack,
                            })
                        }>
                        <Layout style={tw`flex-col`}>
                            <Text>{this.stickerPack.name}</Text>
                            <Text style={tw`text-gray-500 text-xs`}>
                                Willem, Brian, Mika, Rowdy
                            </Text>
                        </Layout>
                    </TouchableOpacity>
                </Layout>
            ),
            headerTitleAlign: "left",
            headerRight: () => (
                <Layout style={tw`flex-row mr-4`}>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text> Share</Text>
                    </TouchableOpacity>
                </Layout>
            ),
        });
    }

    render(): JSX.Element {
        return (
            <SafeAreaView style={tailwind("flex-1 bg-white")}>
                <Body stickerPack={this.stickerPack} onStickerPress={this.onStickerPress} />
                <ToolBar stickerPack={this.stickerPack} />
            </SafeAreaView>
        );
    }
}
