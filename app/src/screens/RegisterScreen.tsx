import React from "react";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";
import * as authApi from "../api/authApi";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { useMutation } from "react-query";
import { logErrorResponse } from "../util/logging";

type Props = StackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen = ({ navigation }: Props) => {
    const [email, setEmail] = React.useState("test_email@gmail.com");
    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");

    const registerMutation = useMutation(authApi.register, {
        onSuccess: (res) => {
            navigation.pop();
        },
        onError: (e: any) => {
            logErrorResponse(e);
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Layout style={styles.registerContainer}>
                    <Text style={styles.text} category="h3">
                        Register
                    </Text>
                    <Input
                        style={styles.input}
                        size="medium"
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}></Input>
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
                    <Button
                        style={styles.button}
                        size="large"
                        onPress={() =>
                            registerMutation.mutate({
                                email,
                                username,
                                password,
                            })
                        }>
                        Register
                    </Button>
                    <Button
                        style={styles.button}
                        appearance="outline"
                        status="basic"
                        size="small"
                        onPress={() => navigation.pop()}>
                        Login
                    </Button>

                    <Text style={styles.text} category="h5">
                        {registerMutation.error?.response?.status == 400
                            ? "Invalid details"
                            : registerMutation.error?.response?.status == 403
                            ? // Forbidden, example: user with that username already exists
                              registerMutation.error?.response?.data.message
                            : ""}
                    </Text>

                    {/* Error messages if invalid details are given */}
                    <Layout>
                        {registerMutation.error?.response?.status == 400 &&
                            registerMutation.error?.response?.data.message.map(
                                (errorMessage: string) => {
                                    const msg =
                                        errorMessage.charAt(0).toUpperCase() +
                                        errorMessage.slice(1);

                                    return (
                                        <Text
                                            key={msg}
                                            status="danger"
                                            appearance="hint"
                                            style={styles.errorText}
                                            category="s1">
                                            {msg}
                                        </Text>
                                    );
                                },
                            )}
                    </Layout>
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
    errorText: {
        textAlign: "center",
        marginVertical: 2,
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
});
