import React from "react";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";
import axios from "../api/axios";
import { AccessTokenContext } from "../contexts/AccessTokenContext";

interface Props {}

export const LoginScreen = (props: Props) => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");

    const [status, setStatus] = React.useState("");

    const login = async () => {
        const body = {
            username,
            password,
        };

        axios
            .post("/auth/login", body)
            .then((res) => {
                setAccessToken(res.data.access_token);
            })
            .catch((e) => {
                console.log(e);
                setStatus("Failed!");
            });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Text style={styles.text}>Token: {!accessToken ? "undefined" : accessToken}</Text>

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
                    <Button style={styles.button} size="large" onPress={login}>
                        Login
                    </Button>
                    <Text style={styles.text} category="h5">
                        {status}
                    </Text>
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
});
