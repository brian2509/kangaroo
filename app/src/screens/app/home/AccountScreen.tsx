import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/AppNavigator";

type Props = StackScreenProps<HomeStackParamList, "AccountScreen">;

export const HomeScreen = ({ navigation }: Props): React.ReactElement => {
    return <SafeAreaView style={tailwind("flex-1")}></SafeAreaView>;
};
