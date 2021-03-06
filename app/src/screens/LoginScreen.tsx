import React from "react";
import { Layout, Text, Button, Input, Spinner } from "@ui-kitten/components";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { useMutation } from "react-query";
import { logErrorResponse } from "../util/logging";
import tailwind from "tailwind-rn";
import { api } from "../api/generatedApiWrapper";
import { LoginUserDto } from "../api/generated-typescript-api-client/src";

type Props = StackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
    const { login } = React.useContext(AuthContext);

    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");

    const loginMutation = useMutation(
        async (loginUserDto: LoginUserDto) => (await api.auth.login(loginUserDto)).data,
        {
            onSuccess: (data) => {
                login(data.access_token);
            },
            onError: (e: any) => {
                logErrorResponse(e);
            },
        },
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Layout style={tailwind("p-2")}>
                    <Image
                        style={tailwind("w-32 h-32 m-14 mt-6 self-center rounded-full")}
                        source={require("../assets/logo/logo.png")}
                    />

                    <Text style={tailwind("text-4xl font-bold pb-4")}>Sign In</Text>
                    <Input
                        style={styles.input}
                        size="medium"
                        label="Username"
                        value={username}
                        onChangeText={setUsername}></Input>
                    <Input
                        style={styles.input}
                        size="medium"
                        label="Password"
                        value={password}
                        onChangeText={setPassword}></Input>
                    <Layout style={tailwind("flex-row items-center justify-between pt-3")}>
                        <Text
                            style={tailwind("pl-2 font-semibold text-blue-500")}
                            onPress={() => {
                                navigation.push("Register");
                            }}>
                            Register
                        </Text>
                        <Button
                            style={tailwind("pl-10 pr-10")}
                            onPress={() => loginMutation.mutate({ username, password })}>
                            Sign in
                        </Button>
                    </Layout>
                    <Text style={styles.text} category="h5">
                        {loginMutation.error &&
                            (loginMutation.error.response?.status == 401
                                ? "Invalid username/password, please try again."
                                : "Login failed!")}
                    </Text>
                    {loginMutation.isLoading && (
                        <Layout style={styles.spinnerContainer}>
                            <Spinner size="giant" />
                        </Layout>
                    )}
                </Layout>
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    text: {
        textAlign: "center",
    },
    registerContainer: {
        width: "100%",
        margin: 16,
    },
    input: {
        width: "100%",
        marginVertical: 4,
    },
    button: {
        marginVertical: 16,
    },
    spinnerContainer: {
        alignSelf: "center",
    },
});
