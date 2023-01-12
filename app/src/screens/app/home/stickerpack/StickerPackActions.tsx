import React from "react"

import { FloatingAction } from "react-native-floating-action";

interface Props {
    onPressUploadSticker: () => void;
    onPressInviteFriends: () => void;
    onPressAddToWhatsapp: () => void;
}
const StickerPackActions = ({ onPressUploadSticker, onPressInviteFriends, onPressAddToWhatsapp }: Props): JSX.Element => {
    return (
        <FloatingAction
            actions={[{
                text: "Add Sticker",
                name: "add_sticker",
                icon: require("../../../../assets/icons/plus.jpg"),
            }, {
                text: "Share Sticker Pack",
                name: "share_sticker_pack",
                icon: require("../../../../assets/icons/share.png"),
                color: "orange"
            }, {
                text: "Add to WhatsApp",
                name: "add_to_whatsapp",
                icon: require("../../../../assets/icons/whatsapp.png"),
                color: "green"
            }]}
            onPressItem={(name) => {
                if (name === "add_sticker") {
                    onPressUploadSticker();
                } else if (name === "share_sticker_pack") {
                    onPressInviteFriends();
                } else if (name === "add_to_whatsapp") {
                    onPressAddToWhatsapp();
                }
            }}
        />
    )
}

export default StickerPackActions;