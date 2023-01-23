import React, { useState, ReactNode } from "react";
import { Layout, Text, Input, Icon, Card, IconProps } from "@ui-kitten/components";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ToastAndroid,
    TouchableWithoutFeedback,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStackNavigator";
import tailwind from "tailwind-rn";
import validate from "validate.js";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLoginMutation, useRegisterMutation } from "../../api/hooks/mutations/auth";
import { TextFieldActions } from "../../components/common/TextFieldActions";

type Props = StackScreenProps<AuthStackParamList, "Register">;

const AlertIcon = (props: IconProps) => <Icon {...props} name="alert-circle-outline" />;

const constraints = {
    email: {
        email: {
            message: "must be a valid address",
        },
    },
    username: {
        presence: true,
        length: {
            minimum: 4,
            maximum: 20,
            message: "must at least contain 4 and at most 20 characters",
        },
        format: {
            pattern: "^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$",
            message: "contains illegal characters",
        },
    },
    password: {
        presence: true,
        length: {
            minimum: 8,
            maximum: 50,
            message: "must at least contain 8 and at most 50 characters",
        },
    },
};

export const RegisterScreen = ({ navigation }: Props): ReactNode => {
    const { login } = useAuthContext();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formInteracted, setFormInteracted] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const registerMutation = useRegisterMutation();

    const loginMutation = useLoginMutation(login);

    const onRegister = () => {
        // Abort registration if input validation has errors
        if (inputValidations) {
            setErrorMessage("Please input all fields correctly.");
            return;
        }

        const dto = {
            email,
            username,
            password,
        };

        registerMutation.mutate(dto, {
            onSuccess: (data, variables) => {
                setErrorMessage(undefined);
                showRegistrationMessage();

                const loginDto = {
                    username: variables.username,
                    password: variables.password,
                };
                loginMutation.mutate(loginDto);
            },
            onError: (error) => {
                const { response } = error;
                if (response?.status == 403) {
                    // 403 Forbidden. Example: user with that username already exists
                    setErrorMessage(response?.data.message);
                    return;
                }

                if (response?.status == 400) {
                    const msg = response.data.message.map((errorMessage: string) => (
                        errorMessage.charAt(0).toUpperCase() +
                        errorMessage.slice(1)
                    ));
                    setErrorMessage(msg);
                    return;
                }

                setErrorMessage("Failed to register, please try again later...");
            }
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const visibilityIcon = (props: IconProps) => (
        <TouchableWithoutFeedback onPress={toggleShowPassword}>
            <Icon {...props} name={showPassword ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );

    const showRegistrationMessage = Platform.select({
        android: () => ToastAndroid.show("Account successfully registered", ToastAndroid.LONG),
        default: () => Alert.alert("Account successfully registered"),
    });

    const inputValidations =
        formInteracted &&
        (validate.validate({ email: email, username: username, password: password }, constraints) ||
            "");
    const isEmailValid = !inputValidations["email"];
    const isUsernameValid = !inputValidations["username"];
    const isPasswordValid = !inputValidations["password"];

    return (
        <SafeAreaView style={tailwind("flex-1 bg-white")}>
            <KeyboardAvoidingView behavior="position">
                <TouchableWithoutFeedback style={tailwind("flex-1")} onPress={Keyboard.dismiss}>
                    <Layout style={tailwind("items-center px-4")}>
                        <Layout
                            style={tailwind("w-full mt-16")}
                            onTouchStart={() => {
                                setErrorMessage(undefined)
                                setFormInteracted(true)
                            }}
                        >
                            <Text style={tailwind("text-4xl font-bold pb-4")}>Register</Text>
                            <Input
                                style={tailwind("w-full")}
                                label="E-mail"
                                value={email}
                                placeholder="Enter your e-mail"
                                caption={(email !== "" && !isEmailValid) && inputValidations["email"][0]}
                                captionIcon={(email !== "" && !isEmailValid) ? AlertIcon : undefined}
                                status={(email !== "" && !isEmailValid) ? "danger" : "basic"}
                                onChangeText={setEmail}
                            />
                            <Input
                                style={tailwind("w-full my-3")}
                                label="Username"
                                value={username}
                                placeholder="Enter your username"
                                caption={(username !== "" && !isUsernameValid) && inputValidations["username"][0]}
                                captionIcon={(username !== "" && !isUsernameValid) ? AlertIcon : undefined}
                                status={(username !== "" && !isUsernameValid) ? "danger" : "basic"}
                                onChangeText={setUsername}
                            />
                            <Input
                                style={tailwind("w-full")}
                                label="Password"
                                value={password}
                                placeholder="Enter your password"
                                accessoryRight={visibilityIcon}
                                secureTextEntry={!showPassword}
                                caption={(password !== "" && !isPasswordValid) ? inputValidations["password"][0] : undefined}
                                captionIcon={(password !== "" && !isPasswordValid) ? AlertIcon : undefined}
                                status={(password !== "" && !isPasswordValid) ? "danger" : "basic"}
                                onChangeText={setPassword}
                            />

                            <Layout style={tailwind("mt-6")}>
                                <TextFieldActions
                                    cancelTitle="Back to Sign In"
                                    doneTitle="Register"
                                    onCancelPress={() => navigation.pop()}
                                    onDonePress={() => {
                                        Keyboard.dismiss();
                                        onRegister();
                                    }}
                                />
                            </Layout>

                            {errorMessage ? (
                                <Card style={tailwind("m-2 mt-20")} status="danger">
                                    <Text
                                        style={tailwind("text-center my-2")}
                                        status="danger"
                                        appearance="hint"
                                        category="s1"
                                    >
                                        {errorMessage}
                                    </Text>
                                </Card>
                            ) : null}
                        </Layout>
                    </Layout>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
