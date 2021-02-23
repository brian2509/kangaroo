import axios from "axios";
import { PUBLIC_IP, PORT } from "@env"

const instance = axios.create({
    baseURL: `http://${PUBLIC_IP}:${PORT}/api/`,
});

export default instance;
