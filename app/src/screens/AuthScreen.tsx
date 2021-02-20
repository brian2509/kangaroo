import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";

interface Props {}

export const AuthScreen = (props: Props) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Text style={styles.text} category="h1">
                    Authentication
                </Text>
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 16,
    },
    text: {
        textAlign: "center",
    },
});
