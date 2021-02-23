import React from "react";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";
import axios from "../api/axios";
import { AccessTokenContext } from "../contexts/AccessTokenContext";

interface Props {}

export const RegisterScreen = (props: Props) => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const [email, setEmail] = React.useState("test_email@gmail.com");
    const [username, setUsername] = React.useState("username2");
    const [password, setPassword] = React.useState("password123");

    const [status, setStatus] = React.useState("");
    const [errors, setErrors] = React.useState([]);

    const register = async () => {
        const body = {
            email,
            username,
            password,
        };

        axios
            .post("/auth/register", body)
            .then(() => {
                setStatus("Registered!");
                setErrors([]);
            })
            .catch((e) => {
                console.log("Error", { response: e.response });
                if (e.response.status == 400) {
                    setStatus("");
                    setErrors(
                        e.response.data.message.map((errorMessage: string) => {
                            return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
                        }),
                    );
                } else if (e.response.status == 403) {
                    setStatus(e.response.data.message);
                    setErrors([]);
                } else {
                    setStatus("Failed!");
                    setErrors([]);
                }
            });
    };

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
                    <Button style={styles.button} size="large" onPress={register}>
                        Register
                    </Button>
                    <Text style={styles.text} category="h5">
                        {status}
                    </Text>
                    <Layout>
                        {errors.map((error, i) => {
                            return (
                                <Text
                                    key={i}
                                    status="danger"
                                    appearance="hint"
                                    style={styles.errorText}
                                    category="s1">
                                    {error}
                                </Text>
                            );
                        })}
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
