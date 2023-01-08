import React from "react";
import { Layout, Text, Input, Spinner, Card, Icon, IconProps } from "@ui-kitten/components";
import { Image, Keyboard, SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStackNavigator";
import tailwind from "tailwind-rn";
import { TextFieldActions } from "../../components/common/TextFieldActions";
import { useLoginMutation } from "../../api/hooks/mutations/auth";

type Props = StackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
    const { login } = React.useContext(AuthContext);

    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");
    const [showPassword, setShowPassword] = React.useState(false);

    const loginMutation = useLoginMutation(login);

    const onLogin = () => {
        const dto = { username, password };

        loginMutation.mutate(dto);
    };

    const visibilityIcon = (props: IconProps) => (
        <TouchableWithoutFeedback onPress={toggleShowPassword}>
            <Icon {...props} name={showPassword ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Layout style={tailwind("flex-1 items-center pt-4 px-4")}>
                <Layout style={tailwind("p-2")}>
                    <Image
                        style={tailwind("w-32 h-32 m-14 mt-6 self-center rounded-full")}
                        source={require("../../assets/logo/logo.png")}
                    />

                    <Text style={tailwind("text-4xl font-bold pb-4")}>Sign In</Text>
                    <Input
                        style={tailwind("w-full mb-4")}
                        size="medium"
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <Input
                        style={tailwind("w-full")}
                        placeholder="**********"
                        accessoryRight={visibilityIcon}
                        secureTextEntry={!showPassword}
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextFieldActions
                        cancelTitle="Register"
                        doneTitle="Sign In"
                        onCancelPress={() => navigation.push("Register")}
                        onDonePress={() => {
                            Keyboard.dismiss();
                            onLogin();
                        }}></TextFieldActions>

                    {loginMutation.error && (
                        <Card style={tailwind("m-4 mt-20")} status="danger">
                            <Text
                                style={tailwind("text-center my-2")}
                                status="danger"
                                appearance="hint"
                                category="s1">
                                {loginMutation.error.response?.status == 401
                                    ? "Invalid username or password, please try again."
                                    : "Login failed!"}
                            </Text>
                        </Card>
                    )}
                    {loginMutation.isLoading && (
                        <Layout style={tailwind("self-center")}>
                            <Spinner size="giant" />
                        </Layout>
                    )}
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};
