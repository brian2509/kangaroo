import { Linking, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { StickerPackRo } from "../api/generated-typescript-api-client/src";
import IntentLauncher from "@yz1311/react-native-intent-launcher";
import Clipboard from "@react-native-clipboard/clipboard";
import axios from "axios";
import { Buffer } from "buffer";

// Code based on: https://gitmemory.com/issue/WhatsApp/stickers/646/653049226

const whatsappUrl = "whatsapp://stickerPack";

/**
 * Requires the following in your app.config.js:
 * "infoPlist": {
 *   "LSApplicationQueriesSchemes": ["whatsapp"]
 * }
 * This can be tested in bare-workflow or a custom client with `expo client:ios`
 */
export async function isAvailableAsync(): Promise<boolean> {
    // https://github.com/WhatsApp/stickers/blob/master/iOS/README.md#structure-of-the-json-file-that-is-sent-to-whatsapp
    return Linking.canOpenURL(whatsappUrl);
}

const base64FromImageUrl = (url: string) => {
    return axios
        .get(url, {
            responseType: "arraybuffer",
        })
        .then((response: any) => Buffer.from(response.data, "binary").toString("base64"));
};

const getAndroidReactContextPackageName = (): string => {
    // com.giraffe
    return DeviceInfo.getBundleId();
};

const sendToWhatsapp = async (json: Record<string, any>): Promise<boolean> => {
    if (Platform.OS === "android") {
        await IntentLauncher.startActivity({
            action: "com.whatsapp.intent.action.ENABLE_STICKER_PACK",
            // category: "com.whatsapp.intent.action",
            packageName: "com.whatsapp",
            extra: {
                // sticker_pack_id: json.identifier,
                // sticker_pack_name: json.name,
                sticker_pack_id: "test_pack",
                sticker_pack_name: "Test Pack",
                // https://github.com/WhatsApp/stickers/tree/master/Android#intent
                // todo: is there an alternative to a native content provider?
                sticker_pack_authority:
                    getAndroidReactContextPackageName() + ".StickerContentProvider",
            },
        });
        return true;
    } else if (Platform.OS === "ios") {
        await Clipboard.setString(
            JSON.stringify([{ "net.whatsapp.third-party.sticker-pack": json }]),
        );
        await Linking.openURL(whatsappUrl);
        return true;
    }

    return false;
};

// Spec https://github.com/WhatsApp/stickers/blob/master/iOS/README.md
export const sendStickerPackToWhatsApp = async (config: {
    /**
     * the sticker pack's name (128 characters max)
     */
    stickerPack: StickerPackRo;
    /**
     * an overall representation of the version of the stickers and tray icon. When you update stickers or tray icon in your pack, please update this string, this will tell WhatsApp that the pack has new content and update the stickers on WhatsApp side.
     */
    image_data_version: string;
    /**
     * this tells WhatsApp that the stickers from your pack should not be cached. By default, you should keep it false. Exception is that if your app updates stickers without user actions, you can keep it true, for example: your app provides clock sticker that updates stickers every minute.
     */
    avoid_cache: boolean;

    // todo: publisher_website, privacy_policy_website, license_agreement_website
}): Promise<boolean> => {
    const json: Record<string, any> = {
        identifier: config.stickerPack.id,
        name: config.stickerPack.name,
        publisher: config.stickerPack.id,
        // android
        image_data_version: config.image_data_version,
        avoid_cache: config.avoid_cache,
    };
    // todo: use image-manipulator to ensure PNG

    json.tray_image = await base64FromImageUrl(
        config.stickerPack.stickers[0].whatsAppIconImageFileUrl,
    );

    const stickersArray: Record<string, any>[] = [];
    const promises = config.stickerPack.stickers.map((sticker) =>
        base64FromImageUrl(sticker.fileUrl),
    );
    await Promise.all(promises).then((base64Encodings) =>
        base64Encodings.forEach((base64Encoding) =>
            stickersArray.push({
                image_data: base64Encoding,
                emojis: [], // Emojis to tag stickers
            }),
        ),
    );

    json.stickers = stickersArray;

    json["ios_app_store_link"] = "https://itunes.apple.com/app/myapp/id123456";
    json["android_play_store_link"] = "https://play.google.com/store/apps/details?id=com.myapp";

    return sendToWhatsapp(json);
};
