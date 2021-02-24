import axios from "axios";

import { DOMAIN_NAME, PORT } from "@env";

const instance = axios.create({
    baseURL: `${DOMAIN_NAME}:${PORT}/api/`,
});

export default instance;
