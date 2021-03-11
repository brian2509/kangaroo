import { useMutation } from "react-query";
import {
    JwtToken,
    LoginUserDto,
    RegisterUserDto,
    UserRo,
} from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const loginUser = async (loginUserDto: LoginUserDto) => {
    const { data } = await api.auth.login(loginUserDto);
    return data;
};

export const useLoginMutation = (loginCallback: (jwtToken: JwtToken) => void) =>
    useMutation<JwtToken, any, LoginUserDto, unknown>(loginUser, {
        onSuccess: (jwtToken) => {
            loginCallback(jwtToken);
        },
    });

const registerUser = async (registerUserDto: RegisterUserDto) => {
    const { data } = await api.auth.register(registerUserDto);
    return data;
};

export const useRegisterMutation = () =>
    useMutation<UserRo, any, RegisterUserDto, unknown>(registerUser);
