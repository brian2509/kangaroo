import { StackScreenProps } from "@react-navigation/stack";
import { Icon, Layout } from "@ui-kitten/components";
import React from "react";
import { Image, SafeAreaView, TouchableOpacity } from "react-native";
import { HomeStackParamList } from "src/navigation/AppNavigator";
import tw from "tailwind-react-native-classnames";
import { StickerRo } from "../../../../api/generated-typescript-api-client/src";

type Props = StackScreenProps<HomeStackParamList, "StickerScreen">;
export class StickerScreen extends React.Component<Props> {
    private sticker: StickerRo;

    constructor(props: Props) {
        super(props);
        this.sticker = props.route.params.sticker;
    }

    componentDidMount(): void {
        this.props.navigation.setOptions({
            headerTitle: "Sticker",
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
                    style={tw.style("rounded-lg w-full", {
                        paddingBottom: "100%",
                    })}
                    source={{ uri: this.sticker.fileUrl }}
                />
            </SafeAreaView>
        );
    }
}
