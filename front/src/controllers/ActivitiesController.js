import { useState, useEffect } from "react";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken";
import * as XLSX from 'xlsx';
import { getDateTime } from "../utils/date";
import CircuitManager from "./canvas/managers/circuitManager";

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

  const sendCircuitToJudge = async (activity_id) => {
    const body = JSON.stringify({
      activity_id: activity_id,
      circuit: CircuitManager.serialize()
    })

    return await axios.post(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/judgeCircuit", 
      body,
    ).then((response) => {
        let resp = response.data;
        console.log(resp);
        if ('ok' === resp.detail) {
          window.alert('Sua nota e: ' + resp.score);
          getActivities();
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
    getActivities(); 
  }, []);

  return {
    activities,
    sendCircuitToJudge,
  };
  
};

export const ManegeActivities = (activity, classroomId) => {
  const [editActivity, setEditActivity] = useState(activity);
  const [studentsScore, setStudentsScore] = useState([]);
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

  const getActivityDetails = () => {
    axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/activityDetails/"+classroomId+"/"+activity.id,
    ).then((response) => {
        let resp = response.data;
        if(resp != null)
          setStudentsScore(resp);
    }).catch((e) => {
        console.log(e);
    });
  }

  const exportarParaExcel = () => {
    // Organiza dados
    let studentsMaxScore = []
    let studentsAllScore = []

    studentsScore.forEach((studentScore) => {
      console.log(studentScore);
      studentsMaxScore.push({
        Nome: studentScore.name,
        Email: studentScore.email,
        'Maior Nota': studentScore.max_score ?? "N/A",
      })

      if(studentScore.scores){
        studentScore.scores.forEach((score) => {
          studentsAllScore.push({
            Nome: studentScore.name,
            Email: studentScore.email,
            Data: getDateTime(score.created_at),
            Nota: score.score,
          })
        })
      }
    })


    // Cria um novo workbook (arquivo Excel)
    const workbook = XLSX.utils.book_new();

    // Cria e adiciona a primeira aba
    const worksheet1 = XLSX.utils.json_to_sheet(studentsMaxScore);
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Notas finais");

    // Cria e adiciona a segunda aba
    const worksheet2 = XLSX.utils.json_to_sheet(studentsAllScore);
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Todas notas");

    // Exporta o arquivo
    XLSX.writeFile(workbook, `notas-${classroomId}-${activity.name}.xlsx`);
  };

  useEffect(() => {
    getActivityDetails()
  }, [activity]);

  useEffect(() => {
    setEditActivity(activity)
  }, [activity]);

  return {
    editActivity,
    setEditActivity,
    saveActivity, 
    studentsScore,
    exportarParaExcel
  };
  
};

export const SolutionMenager = (activity_id) => {
  const [activity, setActivity] = useState();
  const [axios, hasToken] = useAxiosWithToken();

  const getSolution = () => {
      axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/activitySolution/"+activity_id,
      ).then((response) => {
          let resp = response.data;
          console.log(resp);  
          if(resp != null)
            setActivity(resp);
      }).catch((e) => {
          console.log(e);
      });
  }

  useEffect(() => {
    getSolution(); 
  }, [activity_id]);

  return {
    activity,
  };
  
};