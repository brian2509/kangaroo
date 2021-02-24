import React, { useEffect } from "react";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { AccessTokenContext } from "../contexts/AccessTokenContext";
import axios from "../api/axios";

export const TopNavigationBar = () => {
    const { accessToken, setAccessToken } = React.useContext(AccessTokenContext);

    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

    useEffect(() => {
        const updateLoggedIn = () => {
            axios
                .get("/auth/authenticated")
                .then((res) => {
                    if (res.data.authenticated == true) {
                        setLoggedIn(true);
                    } else {
                        setLoggedIn(false);
                    }
                })
                .catch((e) => {
                    setLoggedIn(false);
                });
        };
        updateLoggedIn();
    }, [accessToken]);

    const subtitle = loggedIn ? " (Logged in)" : " (Not logged in)";

    return (
        <>
            <TopNavigation title={"🦒 Giraffe"} subtitle={subtitle} alignment="center" />
            <Divider />
        </>
    );
};
