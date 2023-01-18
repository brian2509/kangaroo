import AsyncStorage from "@react-native-community/async-storage";
import { instance } from "../api/generatedApiWrapper";
import { STORAGE_KEYS } from "../constants/StorageKeys";

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

export const updateAxiosInstanceAccessToken = (accessToken: string | undefined): void => {
    if (accessToken) {
        setAxiosInstanceAccessToken(accessToken)
    } else {
        removeAxiosInstanceAccessToken();
    }
}


export const setAxiosInstanceAccessToken = (accessToken: string): void => {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export const removeAxiosInstanceAccessToken = (): void => {
    instance.defaults.headers.common["Authorization"] = undefined;
}