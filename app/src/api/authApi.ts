import { LoginResponse, LoginRequest } from "./apiTypes";

import axios from "./axios";

export const login = async (options: LoginRequest): Promise<LoginResponse> => {
    const res = await axios.post("/auth/login", options);
    return res.data as LoginResponse;
};
