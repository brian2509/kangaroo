import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse } from "./apiTypes";

import axios from "./axios";

export const login = async (options: LoginRequest): Promise<LoginResponse> => {
    const res = await axios.post("/auth/login", options);
    return res.data as LoginResponse;
};

export const register = async (options: RegisterRequest): Promise<RegisterResponse> => {
    const res = await axios.post("/auth/register", options);
    return res.data as RegisterResponse;
};
