import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon, IconProps, Input, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { TextFieldActions } from "../../../../components/common/TextFieldActions";
import { HomeStackParamList } from "../../../../navigation/app/AppStackNavigator";

const updateScreenTitles = {
    email: "Email",
    password: "Password",
} as const;

type Props = StackScreenProps<HomeStackParamList, "SettingsUpdateScreen">;

export const SettingsUpdateScreen = ({ route, navigation }: Props): React.ReactElement => {
    const [value, setValue] = React.useState("");
    const [confirmValue, setConfirmValue] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const visibilityIcon = (props: IconProps) => (
        <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
            <Icon {...props} name={showPassword ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    const updateValueTitle = updateScreenTitles[route.params.updateValueKey]

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Change " + updateValueTitle,
        });
    }, []);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tw`w-full p-4 bg-transparent`}>
                <Input
                    style={tw`w-full mb-2 bg-white`}
                    size="medium"
                    label={() => (
                        <Text style={tw`text-xs font-semibold pb-1 pl-3`}>
                            {updateValueTitle}
                        </Text>
                    )}
                    placeholder={`Enter new your ${updateValueTitle.toLowerCase()}`}
                    value={value}
                    onChangeText={setValue}
                />
                <Input
                    style={tw`w-full mb-6 bg-white`}
                    size="medium"
                    label={() => (
                        <Text style={tw`text-xs font-semibold pb-1 pl-3`}>
                            Confirm {updateValueTitle}
                        </Text>
                    )}
                    placeholder={`Confirm your new ${updateValueTitle.toLowerCase()}`}
                    value={confirmValue}
                    onChangeText={setConfirmValue}
                />
                <Input
                    style={tw`w-full bg-white`}
                    placeholder="Enter your current password"
                    accessoryRight={visibilityIcon}
                    secureTextEntry={!showPassword}
                    label={() => (
                        <Text style={tw`text-xs font-semibold pb-1 pl-3`}>Current Password</Text>
                    )}
                    value={password}
                    onChangeText={setPassword}
                />
                <Layout style={tailwind("mt-6 bg-transparent")}>
                    <TextFieldActions
                        cancelTitle="Cancel"
                        doneTitle="Save"
                        onCancelPress={() => navigation.pop()}
                        onDonePress={() => console.log("Updating " + route.params.updateValueKey + " to " + value)}
                    />
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
