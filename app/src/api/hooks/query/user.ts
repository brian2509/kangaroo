import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../constants/ReactQueryKeys";
import { logErrorResponse } from "../../../util/logging";
import { api } from "../../generatedApiWrapper";

const getMe = async () => {
    const { data } = await api.users.getOwnPrivateProfile();
    return data;
};

export const useMe = () =>
    useQuery([QUERY_KEYS.me], () => getMe(), {
        onError: logErrorResponse,
    });
