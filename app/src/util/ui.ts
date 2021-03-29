import { Alert, Platform, ToastAndroid } from "react-native";

export const showToast = (
    message: string,
    androidToastSize: number = ToastAndroid.BOTTOM,
): void => {
    Platform.select({
        android: () => ToastAndroid.show(message, androidToastSize),
        default: () => Alert.alert(message),
    })();
};
