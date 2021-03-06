import React from "react";
import tailwind from "tailwind-rn";
import { Layout } from "@ui-kitten/components";
import { StickerPackRo } from "../../api/generated-typescript-api-client/src";
import { TextWithIcon } from "../common/TextWithIcon";

interface Props {
    stickerPack: StickerPackRo;
}

export class StickerPackStats extends React.Component<Props> {
    render(): React.ReactElement {
        const { stickerPack } = this.props;

        return (
            <Layout style={tailwind("flex-row")}>
                <TextWithIcon
                    text={`${stickerPack.likes}`}
                    iconName={"heart-outline"}
                    textStyle={tailwind("text-xs pr-1 text-gray-500")}
                    isGrayed={true}
                />
                <TextWithIcon
                    text={`${stickerPack.views}`}
                    iconName={"eye-outline"}
                    textStyle={tailwind("text-xs pr-1 text-gray-500")}
                    isGrayed={true}
                />
            </Layout>
        );
    }
}
