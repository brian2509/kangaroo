import React, { useState } from "react"
import { Button, Layout, Text } from "@ui-kitten/components"
import tailwind from "tailwind-rn";
import { RefreshControl, ScrollView } from "react-native";

interface NoStickerPacksScreenProps {
    onPressCreateStickerPack: () => void;
    refreshing: boolean;
    onRefresh: () => void;
}
export const NoStickerPacksScreen = ({ onPressCreateStickerPack, refreshing, onRefresh }: NoStickerPacksScreenProps): JSX.Element => (
    <ScrollView
        style={tailwind("bg-white")}
        contentContainerStyle={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }
    >
        <Layout>
            <Text style={tailwind("mb-4 text-4xl tracking-tight font-bold text-gray-900 text-center")}>
                No sticker packs
            </Text>
            <Text style={tailwind("mb-6 font-light text-gray-500 text-lg text-center")}>
                Create your first sticker pack!
            </Text>
        </Layout>
        <Button
            style={tailwind("font-medium rounded-lg text-sm text-sm px-5 py-2.5 mr-2 mb-2")} size="medium"
            onPress={onPressCreateStickerPack}
        >
            Create new Sticker Pack
        </Button>
    </ScrollView>
)
