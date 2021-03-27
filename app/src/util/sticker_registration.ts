import { NativeModules } from "react-native";
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

const { WhatsAppStickersModule } = NativeModules;

export const registerStickerPacks = (data: StickerPackRo[]) => {
    for (let stickerPack of data) {
        // registerStickerPack(String identifier, String name, String publisher, String trayImageFile, String publisherEmail, String publisherWebsite, String privacyPolicyWebsite, String licenseAgreementWebsite, String imageDataVersion, boolean avoidCache, boolean animatedStickerPack, ReadableMap stickersMap)
        const stickerMap: { [id: string]: String } = {};
        for (let sticker of stickerPack.stickers || []) {
            stickerMap[sticker.id + STICKER_FILE_EXTENSION] = "🦘";
        }
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
    }
};
