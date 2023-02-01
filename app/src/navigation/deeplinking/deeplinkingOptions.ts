
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import { DEEPLINK_SITE_DOMAIN } from "../../constants/Deeplinking";

export const deepLinkingOptions: LinkingOptions = {
    prefixes: ["kangaroo://", DEEPLINK_SITE_DOMAIN],
    config: {
        screens: {
            App: {
                initialRouteName: "HomeScreen",
                screens: {
                    JoinStickerPackScreen: "invite/:inviteId",
                },
            },
        },
    },
};