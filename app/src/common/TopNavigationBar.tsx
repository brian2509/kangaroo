import React from "react";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { AuthContext } from "../contexts/AuthContext";

export const TopNavigationBar = () => {
    const { isAuthenticated } = React.useContext(AuthContext);

    const subtitle = isAuthenticated ? " (Logged in)" : " (Not logged in)";

    return (
        <>
            <TopNavigation title={"🦒 Giraffe"} subtitle={subtitle} alignment="center" />
            <Divider />
        </>
    );
};
