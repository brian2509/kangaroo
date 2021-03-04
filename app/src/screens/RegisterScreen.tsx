import React from "react";
import { Layout, Text, Button, Input, Icon, InputProps, Card } from "@ui-kitten/components";
import { ImageProps, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import API from "../api/api";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { useMutation } from "react-query";
import { logErrorResponse } from "../util/logging";
import tailwind from "tailwind-rn";
import validate, { validators } from "validate.js"
import { RenderProp } from "@ui-kitten/components/devsupport";


type Props = StackScreenProps<AuthStackParamList, "Register">;


const AlertIcon = (props: InputProps | Readonly<InputProps> | Partial<ImageProps> | undefined) => (
    <Icon {...props} name='alert-circle-outline' />
);


const constraints = {
    email: {
        email: {
            message: "must be a valid address"
        }
    },
    username: {
        presence: true,
        length: {
            minimum: 5,
            maximum: 10,
            message: "must be between 5 and 20 characters"
        },
        format: {
            pattern: "^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$",
            message: "contains illegal characters"
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 5,
            message: "must at least contain 5 characters"
        }
    }
};

export const RegisterScreen = ({ navigation }: Props) => {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [formInteracted, setFormInteracted] = React.useState(false);


    const registerMutation = useMutation(API.register, {
        onSuccess: (res) => {
            navigation.pop();
        },
        onError: (e: any) => {
            logErrorResponse(e);
        },
    });

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const visibilityIcon = (props: InputProps | Readonly<InputProps> | Partial<ImageProps> | undefined) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );


    const inputValidations = formInteracted && (validate.validate({ "email": email, "username": username, "password": password }, constraints) || "")
    // const defaultStatus = !formInteracted ? 'basic' : undefined
    const isEmailValid = !inputValidations["email"]
    const isUsernameValid = !inputValidations["username"]
    const isPasswordValid = !inputValidations["password"]

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={styles.container}>
                <Layout style={styles.registerContainer} onTouchStart={() => setFormInteracted(true)}>
                    <Text style={tailwind("text-4xl font-bold pb-4")}>Register</Text>
                    <Input
                        style={styles.input}
                        label="E-mail"
                        value={email}
                        placeholder="Enter your E-mail"
                        caption={!isEmailValid && inputValidations["email"][0]}
                        status={!isEmailValid ? "danger" : "basic"}
                        captionIcon={!isEmailValid ? AlertIcon : undefined}
                        onChangeText={setEmail} />
                    <Input
                        style={styles.input}
                        label="Username"
                        value={username}
                        placeholder="Enter your username"
                        caption={!isUsernameValid && inputValidations["username"][0]}
                        status={!isUsernameValid ? "danger" : "basic"}
                        captionIcon={!isUsernameValid ? AlertIcon : undefined}
                        onChangeText={setUsername} />
                    <Input
                        style={styles.input}
                        placeholder="Enter your password"
                        caption={!isPasswordValid && inputValidations["password"][0]}
                        accessoryRight={visibilityIcon}
                        captionIcon={!isPasswordValid ? AlertIcon : undefined}
                        secureTextEntry={secureTextEntry}
                        label="Password"
                        value={password}
                        status={!isPasswordValid ? "danger" : "basic"}
                        onChangeText={setPassword} />

                    <Layout style={tailwind("flex-row items-center justify-between pt-3")}>
                        <Text
                            style={tailwind("pl-2 font-semibold text-blue-500")}
                            onPress={() => navigation.pop()}>
                            Back to Login
                        </Text>
                        <Button
                            style={tailwind("pl-10 pr-10")}
                            onPress={() =>
                                !inputValidations &&
                                registerMutation.mutate({
                                    email,
                                    username,
                                    password,
                                })
                            }
                            disabled={formInteracted && !!inputValidations}>
                            Register
                        </Button>
                    </Layout>

                    {registerMutation.error &&
                        (<Card style={styles.card} status='danger'>
                            <Text style={styles.text} category="h6">
                                {registerMutation.error?.response?.status == 400
                                    ? "Invalid details"
                                    : registerMutation.error?.response?.status == 403
                                        ? // 403 Forbidden. Example: user with that username already exists
                                        registerMutation.error?.response?.data.message
                                        : ""}
                            </Text>
                        </Card>
                        )}

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
    card: {
        margin: 2,
        marginTop: 20,
    },
});
