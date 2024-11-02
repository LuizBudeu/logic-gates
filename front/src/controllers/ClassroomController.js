import { useState, useEffect } from "react";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken";
import { useNavigate } from 'react-router-dom';

export const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [axios, hasToken] = useAxiosWithToken();

  const getClassrooms = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/listClassrooms",
      ).then((response) => {
          let resp = response.data;
          if(resp != null)
            setClassrooms(resp);
      }).catch((e) => {
          console.log(e);
      });
  }

  useEffect(() => {
    getClassrooms(); 
  }, []);

  return [
    classrooms,
    getClassrooms, 
  ];
  
};

export const ClassroomInfo = (id) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [axios, hasToken] = useAxiosWithToken();

  const navigate = useNavigate();

  const getClassroomInfo = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/classroomInfo/" + id,
      ).then((response) => {
          let resp = response.data;
          if(resp != null)
            setName(resp.name);
      }).catch((e) => {
          console.log(e);
      });
  }

  const saveClassroom = () => {
    // Set initial error values to empty
    setError('')
      
    // Check if the user has entered both fields correctly
    if ('' === name) {
      setError('Insira um nome');
      return
    }

    const body = JSON.stringify({ 
      'id': id, 
      'name': name 
    })

    axios.post(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/saveClassroom", 
      body,
    ).then((response) => {
        let resp = response.data;
        if ('ok' === resp.detail) {
          navigate(-1);
        } else {
          window.alert('Falha ao salvar turma');
        }
    }).catch((e) => {
        console.log(e);
    });
  }

  useEffect(() => {
    if(id){
      getClassroomInfo(); 
    }
  }, [id]);

  return [
    name,
    setName,
    error,
    getClassroomInfo, 
    saveClassroom,
  ];
  
};

export const ClassroomDetails = (id) => {
  const [classroom, setClassroom] = useState();
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [axios, hasToken] = useAxiosWithToken();

  const getClassroomDetails = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/classroomDetails/" + id,
      ).then((response) => {
        let resp = response.data;
        console.log(resp);
        if(resp != null){
          setClassroom(resp.classroom);
          setStudents(resp.students);
          setActivities(resp.activities);
        } 
      }).catch((e) => {
          console.log(e);
      });
  }

  const updateActivityOnList = (updatedActivity) => {
    setActivities((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedActivity.id ? updatedActivity : item
      )
    );
  }

  useEffect(() => {
    if(id){
      getClassroomDetails(); 
    }
  }, [id]);

  return {
    classroom,
    students,
    activities,
    updateActivityOnList,
    getClassroomDetails,
  };
  
};