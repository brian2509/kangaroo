export interface Sticker {
    id: string;
    name: string;
    url: string;
}

export interface StickerPack {
    id: string;
    name: string;
    private: boolean;
    stickers: Sticker[];
}
