export interface User {
    id: string;
    username: string;
}

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
    members: User[];
    views: number;
    likes: number;
}

export interface AddStickerPackRo {
    name: string;
    private: boolean;
}

export interface DeleteStickerPackRo {
    id: string;
}

export interface UploadStickerRo {
    stickerPackId: string;
    formData: FormData;
}

export interface LoginResponse {
    access_token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    id: string;
    username: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface IsAuthenticatedResponse {
    authenticated: boolean;
}
