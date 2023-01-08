import React, { useEffect } from "react";
import tailwind from "tailwind-rn";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { FeedStackParamList } from "../../../navigation/app/AppStackNavigator";
import { Icon, IconProps, Input, Layout, Text } from "@ui-kitten/components";
import tw from "tailwind-react-native-classnames";
import { TextFieldActions } from "../../../components/common/TextFieldActions";

type Props = StackScreenProps<FeedStackParamList, "SettingsUpdateScreen">;

export const SettingsUpdateScreen = ({ route, navigation }: Props): React.ReactElement => {
    const [updateValue, setUpdateValue] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const visibilityIcon = (props: IconProps) => (
        <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
            <Icon {...props} name={showPassword ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    useEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.updateValueTitle,
        });
    }, []);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tw`w-full p-4 bg-transparent`}>
                <Input
                    style={tw`w-full mb-4 bg-white`}
                    size="medium"
                    label={() => (
                        <Text style={tw`text-xs font-semibold pb-1 pl-3`}>
                            {route.params.updateValueTitle}
                        </Text>
                    )}
                    placeholder={`Enter your ${route.params.updateValueTitle.toLocaleLowerCase()}`}
                    value={updateValue}
                    onChangeText={setUpdateValue}
                />
                <Input
                    style={tw`w-full bg-white`}
                    placeholder="**********"
                    accessoryRight={visibilityIcon}
                    secureTextEntry={!showPassword}
                    label={() => (
                        <Text style={tw`text-xs font-semibold pb-1 pl-3`}>Current Password</Text>
                    )}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextFieldActions
                    cancelTitle="Cancel"
                    doneTitle="Save"
                    onCancelPress={() => navigation.pop()}
                    onDonePress={() => route.params.onSave}></TextFieldActions>
            </Layout>
        </SafeAreaView>
    );
};
