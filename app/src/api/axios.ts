import axios from "axios";

const instance = axios.create({
    baseURL: `${process.env.DOMAIN_NAME}:${process.env.PORT}/api/`,
});

export default instance;
