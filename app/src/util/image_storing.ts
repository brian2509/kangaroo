import RNFS from "react-native-fs";
import { StickerPackRo } from "src/api/generated-typescript-api-client/src";

const STICKER_FOLDER_NAME = "/sticker_packs";
const STICKER_FILE_EXTENSION = ".webp";

// TODO: Add removal of images.

export const storeImages = async (data: StickerPackRo[]): Promise<void> => {
    const directories = data.map((val) => val.id);
    const path = RNFS.DocumentDirectoryPath + STICKER_FOLDER_NAME;
    // TODO: use "RNFS.MainBundlePath" on iOS?

    // Always make dir, as it will fill silently if it already exists.
    try {
        await RNFS.mkdir(path);
    } catch (err) {
        console.log(err.message, err.code);
    }

    const result = await RNFS.readDir(path);

    // Mark directories for removal.
    const foundDirectories = result.filter((res) => res.isDirectory());
    const directoriesToRemove = foundDirectories.filter((val) => !directories.includes(val.name));
    for (const directory of directoriesToRemove) {
        await RNFS.unlink(directory.path);
    }

    // Loop over each stickerPack we know about.
    for (const stickerPack of data) {
        const stickerPackPath = path + "/" + stickerPack.id;

        // Check if the path of the sticker pack exists locally.
        const exists = await RNFS.exists(stickerPackPath);

        // If there exists no directory for the stickerpack.
        if (!exists) {
            // Mkdir and download each sticker directly.
            await RNFS.mkdir(stickerPackPath);
            for (const sticker of stickerPack.stickers) {
                const stickerPath = stickerPackPath + "/" + sticker.id + STICKER_FILE_EXTENSION;
                downloadFile(sticker.whatsAppStickerImageFileUrl, stickerPath);
            }
        } else {
            // Else read the directory.
            const result = await RNFS.readDir(stickerPackPath);
            // Delete remotely removed stickers.
            const ids = stickerPack.stickers.map((val) => val.id + STICKER_FILE_EXTENSION);
            const stickersToDelete = result.filter((item) => !ids.includes(item.name));

            for (const sticker of stickersToDelete) {
                console.log("Deleting: " + sticker.path);
                await RNFS.unlink(sticker.path);
            }

            // Download stickers that do not exist.
            for (const sticker of stickerPack.stickers) {
                const stickerPath = stickerPackPath + "/" + sticker.id + STICKER_FILE_EXTENSION;
                const exists = await RNFS.exists(stickerPath);

                if (!exists) {
                    downloadFile(sticker.whatsAppStickerImageFileUrl, stickerPath);
                } else {
                    console.log("Sticker " + stickerPath + " already existed");
                }
            }
        }
    }
};

const downloadFile = async (fileUrl: string, localPath: string) => {
    try {
        const response = await RNFS.downloadFile({
            fromUrl: fileUrl,
            toFile: localPath,
        }).promise;

        if (response.statusCode == 200) {
            console.log("FILE DOWNLOADED!"); // response.statusCode, response.headers, response.body
            console.log("---" + localPath);
        } else {
            console.log("SERVER ERROR: " + response.statusCode + " For Sticker: " + localPath);
            // TODO: File cleanup?
        }
    } catch (err) {
        if (err.description === "cancelled") {
            // cancelled by user
        }
        console.log(err);
    }
};
