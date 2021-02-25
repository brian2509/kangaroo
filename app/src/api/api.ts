import {
    AddStickerPackRo,
    DeleteStickerPackRo,
    Sticker,
    StickerPack,
    UploadStickerRo,
    LoginResponse,
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    IsAuthenticatedResponse,
} from "./apiTypes";
import axios from "./axios";

export namespace API {
    export const fetchMyStickerPacks = async (): Promise<StickerPack[]> => {
        return axios.get("me/sticker-packs").then((res: any) => {
            return res.data.map((entry: any) => {
                return {
                    id: entry.id,
                    name: entry.name,
                    private: entry.private,
                    stickers: entry.stickers.map((stickerEntry: any) => {
                        return {
                            id: stickerEntry.id,
                            name: stickerEntry.name,
                            url: stickerEntry.url,
                        };
                    }),
                    members: entry.members.map((member: any) => {
                        return {
                            id: member.id,
                            name: member.name,
                        };
                    }),
                    views: entry.views,
                    likes: entry.likes,
                };
            });
        });
    };

    export const addStickerPack = async (options: AddStickerPackRo): Promise<StickerPack> => {
        const res = await axios.post("sticker-packs", options);
        return res.data as StickerPack;
    };

    export const deleteStickerPack = async (options: DeleteStickerPackRo): Promise<void> => {
        await axios.delete(`sticker-packs/${options.id}`);
    };

    export const uploadSticker = async (options: UploadStickerRo): Promise<Sticker> => {
        const res = await axios.post(
            `sticker-packs/${options.stickerPackId}/stickers`,
            options.formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return res.data as Sticker;
    };

    export const login = async (options: LoginRequest): Promise<LoginResponse> => {
        const res = await axios.post("/auth/login", options);
        return res.data as LoginResponse;
    };

    export const register = async (options: RegisterRequest): Promise<RegisterResponse> => {
        const res = await axios.post("/auth/register", options);
        return res.data as RegisterResponse;
    };

    export const isAuthenticated = async (): Promise<IsAuthenticatedResponse> => {
        const res = await axios.get("/auth/authenticated");
        return res.data as IsAuthenticatedResponse;
    };
}
