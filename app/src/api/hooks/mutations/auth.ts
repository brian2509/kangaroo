import { useMutation } from "react-query";
import { logErrorResponse } from "../../../util/logging";
import { JwtToken, LoginUserDto, RegisterUserDto } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const loginUser = async (loginUserDto: LoginUserDto) => {
    const { data } = await api.auth.login(loginUserDto);
    return data;
};

export const useLoginMutation = (loginCallback?: (token: JwtToken) => void) =>
    useMutation(loginUser, {
        onSuccess: (data) => {
            loginCallback && loginCallback(data);
        },
        onError: (e: any) => {
            logErrorResponse(e);
        },
    });

const registerUser = async (registerUserDto: RegisterUserDto) => {
    const { data } = await api.auth.register(registerUserDto);
    return data;
};

export const useRegisterMutation = () =>
    useMutation(registerUser, {
        onError: (e: any) => {
            logErrorResponse(e);
        },
    });
