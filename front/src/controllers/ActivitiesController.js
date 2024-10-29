import { useState, useEffect } from "react";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken";

export const StudentActivities = () => {
  const [activities, setActivities] = useState();
  const [axios, hasToken] = useAxiosWithToken();

  const getActivities = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/listActivities",
      ).then((response) => {
          let resp = response.data;
          if(resp != null)
            setActivities(resp);
      }).catch((e) => {
          console.log(e);
      });
  }

  useEffect(() => {
    getActivities(); 
  }, []);

  return [
    activities,
    getActivities, 
  ];
  
};