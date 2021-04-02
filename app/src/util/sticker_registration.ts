import { NativeModules, Platform } from "react-native";
import { StickerPackRo } from "../api/generated-typescript-api-client/src";
import {
    DEFAULT_TRAY_ICON,
    PLAYSTORE_URL,
    PUBLISHER_EMAIL,
    PUBLISHER_LICENSE,
    PUBLISHER_NAME,
    PUBLISHER_PRIVACY_POLICY,
    PUBLISHER_WEBSITE,
    STICKER_FILE_EXTENSION,
} from "../constants/StickerInfo";

// TODO make this a valid module.
const { WhatsAppStickersModule } = NativeModules;

export const registerStickerPacks = (data: StickerPackRo[]) => {
    for (let stickerPack of data) {
        // TODO: only register packs with > 2 stickers?
        const stickerMap: { [id: string]: String } = {};
        for (let sticker of stickerPack.stickers || []) {
            stickerMap[sticker.id + STICKER_FILE_EXTENSION] = "🦘";
        }
        if (Platform.OS == "android") {
            WhatsAppStickersModule.registerStickerPack(
                stickerPack.id,
                stickerPack.name,
                PUBLISHER_NAME,
                DEFAULT_TRAY_ICON,
                PUBLISHER_EMAIL,
                PUBLISHER_WEBSITE,
                PUBLISHER_PRIVACY_POLICY,
                PUBLISHER_LICENSE,
                PLAYSTORE_URL,
                stickerPack.updatedAt,
                true,
                stickerPack.animated,
                stickerMap,
            );
        } else {
            console.log("iOS `registerStickerPack` functionality not yet implemented");
            console.log("Paul, doe je best :)");
        }
    }
};
