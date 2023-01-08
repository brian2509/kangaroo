
import React, { useEffect } from "react";
import tailwind from "tailwind-rn";

import { SafeAreaView } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/app/AppStackNavigator";

type Props = StackScreenProps<HomeStackParamList, "SettingsScreen">;

export const PrivacyPolicyScreen = ({ navigation }: Props): React.ReactElement => {

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Privacy Policy",
        });
    }, [])

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("w-full h-full flex justify-center items-center bg-transparent")}>
                <Text style={tailwind("text-3xl font-bold")}>We care very much</Text>
                <Text style={tailwind("mt-2")}>This is a placeholder...</Text>
            </Layout>
        </SafeAreaView>
    );
};
