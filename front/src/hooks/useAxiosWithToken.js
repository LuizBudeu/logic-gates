import axios from "axios"
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useAxiosWithToken = () => {
    const { user } = useAuth();
    const [hasToken, setHasToken] = useState(false);

    const axiosWithToken = axios.create();

    useEffect(() => {
        if (user) {
            axiosWithToken.interceptors.request.use(function (config) {
                config.headers = { ...config.headers, Authorization: 'Bearer ' + user["token"] }
                return config;
            });
            setHasToken(true);
        }
    }, [axiosWithToken.interceptors.request, user])

    return [axiosWithToken, hasToken];
}