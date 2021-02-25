import React from "react";
import { Layout, Text, Button, Input, Spinner } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";
import { AccessTokenContext } from "../contexts/AccessTokenContext";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { API } from "../api/api";
import { useMutation } from "react-query";
import { logErrorResponse } from "../util/logging";

type Props = StackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");

    const loginMutation = useMutation(API.login, {
        onSuccess: (res) => {
            setAccessToken(res.access_token);
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
                        Login
                    </Text>
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
                        onPress={() => loginMutation.mutate({ username, password })}>
                        Login
                    </Button>
                    <Button
                        style={styles.button}
                        appearance="outline"
                        status="basic"
                        size="small"
                        onPress={() => {
                            navigation.push("Register");
                        }}>
                        Register
                    </Button>
                    <Text style={styles.text} category="h5">
                        {loginMutation.error &&
                            (loginMutation.error.response?.status == 401
                                ? "Invalid password, please try again."
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
