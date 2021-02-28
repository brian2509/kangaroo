import { StackScreenProps } from "@react-navigation/stack";
import { Icon, Layout } from "@ui-kitten/components";
import React from "react";
import { Image, SafeAreaView, TouchableOpacity } from "react-native";
import { Sticker } from "src/api/apiTypes";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";

type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
export class StickerScreen extends React.Component<Props> {
    private sticker: Sticker;

    constructor(props: Props) {
        super(props);
        this.sticker = props.route.params.sticker;
    }

    componentDidMount(): void {
        this.props.navigation.setOptions({
            headerTitle: this.sticker.name,
            headerRight: () => (
                <Layout style={tw`flex-row mr-4`}>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Icon name="download" fill="black" width={25} height={25} />
                    </TouchableOpacity>
                </Layout>
            ),
        });
    }

    render(): JSX.Element {
        return (
            <SafeAreaView style={tw`flex justify-center h-full bg-white`}>
                <Image
                    style={tw.style("rounded-lg", {
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 3,
                    })}
                    source={{ uri: this.sticker.url }}
                />
            </SafeAreaView>
        );
    }
}
