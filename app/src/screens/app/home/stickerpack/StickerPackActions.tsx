import React from "react"

import { FloatingAction } from "react-native-floating-action";

interface Props {
    onPressUploadSticker: () => void;
    onPressInviteFriends: () => void;
    onPressAddToWhatsapp: () => void;
    onPressDeleteStickerPack: () => void;
}
const StickerPackActions = ({
    onPressUploadSticker,
    onPressInviteFriends,
    onPressAddToWhatsapp,
    onPressDeleteStickerPack
}: Props): JSX.Element => {
    return (
        <FloatingAction
            floatingIcon={require("../../../../assets/icons/dots.png")}
            actions={[{
                text: "Add Sticker",
                name: "add_sticker",
                icon: require("../../../../assets/icons/plus.jpg"),
            }, {
                text: "Invite friends",
                name: "invite_friends",
                icon: require("../../../../assets/icons/share.png"),
                color: "orange"
            }, {
                text: "Add to WhatsApp",
                name: "add_to_whatsapp",
                icon: require("../../../../assets/icons/whatsapp.png"),
                color: "green"
            }, {
                text: "Delete Stickerpack",
                name: "delete_stickerpack",
                icon: require("../../../../assets/icons/trash.png"),
                color: "darkred"
            }]}
            onPressItem={(name) => {
                if (name === "add_sticker") {
                    onPressUploadSticker();
                } else if (name === "invite_friends") {
                    onPressInviteFriends();
                } else if (name === "add_to_whatsapp") {
                    onPressAddToWhatsapp();
                } else if (name === "delete_stickerpack") {
                    onPressDeleteStickerPack();
                }
            }}
        />
    )
}

export default StickerPackActions;