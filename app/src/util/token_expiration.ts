import dayjs from "dayjs";
import jwtDecode from "jwt-decode";

interface ParsedJwtToken {
    username: string,
    sub: string,
    iat: number,
    exp: number
}
const decodeJwtToken = (jwtToken: string) => {
    return jwtDecode<ParsedJwtToken>(jwtToken);
}

export const isJwtTokenExpired = (accessToken: string): boolean => {
    const decoded = decodeJwtToken(accessToken);

    const expiryDateUnix = decoded.exp;
    const nowUnix = dayjs.utc().unix();
    const diffUnix = nowUnix - expiryDateUnix;

    return diffUnix > 0;
}
