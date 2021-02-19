import React from "react";
import {Divider, Layout, Text, TopNavigation} from "@ui-kitten/components";
import {SafeAreaView, StyleSheet} from "react-native";

export const HomeScreen = () => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <TopNavigation title="🦒 Giraffe" alignment="center" />
            <Divider />
            <Layout style={styles.container}>
                <Text style={styles.text} category="h1">
                    Welcome to this amazing sticker app! 🦒Welcome to this amazing sticker app! 🦒Welcome to this
                    amazing sticker app! 🦒Welcome to this amazing sticker app! 🦒
                </Text>
                <Text style={styles.text} appearance="hint">
                    That does nothing!
                </Text>
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
    },
    likeButton: {
        marginVertical: 16,
    },
});
