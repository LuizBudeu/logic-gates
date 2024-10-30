import axios from "axios"
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { UserIsLoggedIn } from "./userIsLoggedIn";

export const useAxiosWithToken = () => {
    const [cookies] = useCookies();
    const loggedIn = UserIsLoggedIn();
    const [hasToken, setHasToken] = useState(false);

    const axiosWithToken = axios.create();

    useEffect(() => {
        if (loggedIn) {
            axiosWithToken.interceptors.request.use(function (config) {
                config.headers = { ...config.headers, Authorization: 'Bearer ' + cookies["token"] }
                return config;
            });
            setHasToken(true);
        }
    }, [axiosWithToken.interceptors.request, loggedIn])

    return [axiosWithToken, hasToken];
}