import React from "react";
import tailwind from "tailwind-rn";
import tw from "tailwind-react-native-classnames";
import { Button, Icon, Input, Layout, Text } from "@ui-kitten/components";

interface Props {
    onCreateStickerPack: () => void;
    onLogout: () => void;
}

export class HomeScreenHeader extends React.Component<Props> {
    AddIcon = (props: any) => (
        <Icon style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })} name="plus" />
    );
    LogoutIcon = (props: any) => (
        <Icon
            style={tw.style("w-6 h-6", { tintColor: props.style.tintColor })}
            name="person-delete-outline"
        />
    );

    HeaderIcons = (): React.ReactElement => (
        <Layout style={tailwind("flex-row self-start bg-transparent")}>
            <Button
                appearance="ghost"
                style={tailwind("px-1")}
                onPress={this.props.onCreateStickerPack}
                accessoryLeft={this.AddIcon}
            />
            <Button
                appearance="ghost"
                status="danger"
                onPress={this.props.onLogout}
                accessoryLeft={this.LogoutIcon}
            />
        </Layout>
    );

    render(): React.ReactElement {
        return (
            <Layout style={tailwind("p-5 pb-3 pt-1 bg-gray-100")}>
                <Layout
                    style={tailwind(
                        "flex-row justify-between pt-2 pb-1 bg-transparent items-center",
                    )}>
                    <Text style={tailwind("text-4xl font-semibold bg-transparent")}>
                        Sticker Packs
                    </Text>
                    <this.HeaderIcons />
                </Layout>
                <Input
                    accessoryLeft={(props: any) => <Icon {...props} name="search" />}
                    style={tw`rounded-xl`}
                    placeholder="Search"
                />
            </Layout>
        );
    }
}
