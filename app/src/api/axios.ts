import axios from "axios";
import { PORT, PUBLIC_IP } from "@env"

const instance = axios.create({
    baseURL: `http://${PUBLIC_IP}:${PORT}/api/`,
});

export default instance;
