import React, { useEffect, useState } from "react";
import { Divider, Layout, List, ListItem, Text, Button, Icon } from "@ui-kitten/components";
import { Image, Platform, SafeAreaView, StyleSheet } from "react-native";
import { AccessTokenContext } from "../contexts/AccessTokenContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/AppNavigator";
import tailwind from "tailwind-rn";

type Props = StackScreenProps<HomeStackParamList, "StickerDetailScreen">;

export const StickerDetailScreen = ({ route }: Props): Element => {
    const stickerPack = route.params.stickerPack;

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("flex-row h-1/6 justify-between p-4")}>
                <Layout style={tailwind("flex-col w-1/2 justify-between")}>
                    <Text style={tailwind("")} category="p1">
                        {stickerPack.name}
                    </Text>
                    <Text style={tailwind("")} category="p1">
                        Admin: TODO
                    </Text>
                    <Text style={tailwind("")} category="p1">
                        999 members
                    </Text>
                    <Layout style={tailwind("flex-row pt-2 text-gray-300 justify-between")}>
                        <Text style={tailwind("")} category="p2">
                            999 Likes
                        </Text>
                        <Text style={tailwind("")} category="p2">
                            12k Views
                        </Text>
                    </Layout>
                </Layout>
                <Layout style={tailwind("flex-col text-gray-300")}>
                    <Text style={tailwind("")} category="p2">
                        19:09
                    </Text>
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
