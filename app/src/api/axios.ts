import axios from "axios";

import { DOMAIN_NAME, PORT } from "@env";
import { api } from "./generatedApiWrapper";

const instance = axios.create({
    baseURL: `${DOMAIN_NAME}:${PORT}/api/`,
});

// Example code.
(async () => {
    try {
        const auth = await api.auth.testAuth();
        console.log(auth.data.authenticated);
    } catch (e) {
        console.log(e);
    }
})();

export default instance;
