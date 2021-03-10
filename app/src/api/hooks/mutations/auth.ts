import { useMutation } from "react-query";
import { LoginUserDto, RegisterUserDto } from "../../generated-typescript-api-client/src";
import { api } from "../../generatedApiWrapper";

const loginUser = async (loginUserDto: LoginUserDto) => {
    const { data } = await api.auth.login(loginUserDto);
    return data;
};

export const useLoginMutation = () => useMutation(loginUser);

const registerUser = async (registerUserDto: RegisterUserDto) => {
    const { data } = await api.auth.register(registerUserDto);
    return data;
};

export const useRegisterMutation = () => useMutation(registerUser);
