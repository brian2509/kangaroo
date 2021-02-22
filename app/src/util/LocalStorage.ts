import AsyncStorage from "@react-native-community/async-storage";
import { KEYS } from "../constants/StorageKeys";

export const getStoredAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(KEYS.accessTokenKey);
};
