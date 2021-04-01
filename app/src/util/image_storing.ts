import { StickerPackRo } from "src/api/generated-typescript-api-client/src";
import RNFS from "react-native-fs";

const STICKER_FOLDER_NAME = "/sticker_packs";
const STICKER_FILE_EXTENSION = ".webp";

// TODO: Add removal of images.

export const storeImages = (data: StickerPackRo[]) => {
    const directories = data.map((val) => val.id);
    const path = RNFS.DocumentDirectoryPath + STICKER_FOLDER_NAME;
    // TODO: use "RNFS.MainBundlePath" on iOS?

    // Always make dir, as it will fill silently if it already exists.
    RNFS.mkdir(path).then(() => {
        RNFS.readDir(path)
            .then((result) => {
                // Mark directeries for removal.
                const foundDirectories = result.filter((res) => res.isDirectory());
                const directoriesToRemove = foundDirectories.filter(
                    (val) => !directories.includes(val.name),
                );
                for (let dir of directoriesToRemove) {
                    RNFS.unlink(dir.path);
                }

                // Loop over each stickerPack we know about.
                for (let stickerPack of data) {
                    const stickerPackPath = path + "/" + stickerPack.id;

                    // Check if the path of the sticker pack exists locally.
                    RNFS.exists(stickerPackPath).then((exists) => {
                        // If there exists no directory for the stickerpack.
                        if (!exists) {
                            // Mkdir and download each sticker directly.
                            RNFS.mkdir(stickerPackPath).then(() => {
                                for (let sticker of stickerPack.stickers) {
                                    const stickerPath =
                                        stickerPackPath + "/" + sticker.id + STICKER_FILE_EXTENSION;

                                    downloadFile(sticker.whatsAppStickerImageFileUrl, stickerPath);
                                }
                            });
                        } else {
                            // Else read the directory.
                            RNFS.readDir(stickerPackPath).then((result) => {
                                // Delete remotely removed stickers.
                                const ids = stickerPack.stickers.map(
                                    (val) => val.id + STICKER_FILE_EXTENSION,
                                );
                                const stickersToDelete = result.filter(
                                    (item) => !ids.includes(item.name),
                                );
                                for (let sticker of stickersToDelete) {
                                    console.log("deleting: " + sticker.path);
                                    RNFS.unlink(sticker.path);
                                }

                                // Download stickers that do not exist.
                                for (let sticker of stickerPack.stickers) {
                                    const stickerPath =
                                        stickerPackPath + "/" + sticker.id + STICKER_FILE_EXTENSION;
                                    RNFS.exists(stickerPath).then((exists) => {
                                        if (!exists) {
                                            downloadFile(
                                                sticker.whatsAppStickerImageFileUrl,
                                                stickerPath,
                                            );
                                        } else {
                                            console.log(
                                                "Sticker " + stickerPath + " already existed",
                                            );
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    });
};

const downloadFile = (fileUrl: string, localPath: string) => {
    RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localPath,
    })
        .promise.then((response) => {
            if (response.statusCode == 200) {
                console.log("FILE DOWNLOADED!"); // response.statusCode, response.headers, response.body
                console.log("---" + localPath);
            } else {
                console.log("SERVER ERROR: " + response.statusCode + " For Sticker: " + localPath);
                // TODO: File cleanup?
            }
        })
        .catch((err) => {
            if (err.description === "cancelled") {
                // cancelled by user
            }
            console.log(err);
        });
};
