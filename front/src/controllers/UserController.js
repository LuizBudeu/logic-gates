import { useState, useEffect } from "react";
import { useAxiosWithToken } from "../utils/UseAxiosWithToken";

export const UserInfo = () => {
  const [user, setUser] = useState();
  const [axios, hasToken] = useAxiosWithToken();

  const getUserInfo = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/user",
      ).then((response) => {
          let resp = response.data;
          if(resp != null)
              setUser(resp);
      }).catch((e) => {
          console.log(e);
      });
  }

  useEffect(() => {
    getUserInfo(); 
  }, []);

  return [
      user,
      getUserInfo, 
  ];
  
};