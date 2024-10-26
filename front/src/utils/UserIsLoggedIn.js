import { useCookies } from "react-cookie";

export const UserIsLoggedIn = () => {
    const [cookies] = useCookies();
    return !!cookies['token'];
}