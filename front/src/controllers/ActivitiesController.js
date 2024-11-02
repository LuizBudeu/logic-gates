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

export const ManegeActivities = (activity, classroomId) => {
  const [editActivity, setEditActivity] = useState(activity);
  const [axios, hasToken] = useAxiosWithToken();

  const saveActivity = async () => {
    const body = JSON.stringify({
      activity: editActivity,
      classroomId: classroomId
    })

    return await axios.post(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/saveActivity", 
      body,
    ).then((response) => {
        let resp = response.data;
        if ('ok' === resp.detail) {
          return true;
        } else {
          window.alert('Falha ao salvar atividade');
          return false;
        }
    }).catch((e) => {
        console.log(e);
        return false;
    });
  }

  useEffect(() => {
    setEditActivity(activity)
  }, [activity]);

  return {
    editActivity,
    setEditActivity,
    saveActivity, 
  };
  
};