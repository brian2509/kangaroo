import { Alert, Platform, ToastAndroid } from "react-native";

export const showToast = (
    message: string,
    androidToastSize: number = ToastAndroid.BOTTOM,
): void => {
    Platform.select({
        android: () => ToastAndroid.show(message, androidToastSize),
        // TODO: find Toast method for iOS
        default: () => Alert.alert(message),
    })();
};
