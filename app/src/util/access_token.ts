import { AxiosInstance } from "axios";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateLocalAccessToken = async (accessToken: string | undefined): Promise<void> => {
    if (accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.accessTokenKey, accessToken);
    } else {
        await removeLocalAccessToken();
    }
}

export const removeLocalAccessToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.accessTokenKey);
}

export const getLocalAccessToken = async (): Promise<string | undefined> => {
    const storedAccessToken = await AsyncStorage.getItem(STORAGE_KEYS.accessTokenKey);

    if (storedAccessToken === null || storedAccessToken === "") {
        return undefined;
    }

    return storedAccessToken;
}

export const updateAxiosInstanceAccessToken = (
    axiosInstance: AxiosInstance, 
    accessToken: string | undefined
): void => {
    if (accessToken) {
        setAxiosInstanceAccessToken(axiosInstance, accessToken)
    } else {
        removeAxiosInstanceAccessToken(axiosInstance);
    }
}


export const setAxiosInstanceAccessToken = (axiosInstance: AxiosInstance, accessToken: string): void => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export const removeAxiosInstanceAccessToken = (axiosInstance: AxiosInstance): void => {
    axiosInstance.defaults.headers.common["Authorization"] = undefined;
}
