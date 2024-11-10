import { getDateTime } from "../utils/date";
import { Row } from "./Row";
import { StatusBadge } from "./StatusBadge";
import { RowItem } from "./RowItem";
import { Column } from "./Column";
import { getActivityStatus } from "../utils/utils";
import { MdEditStyle } from './MdEditStyle.js';
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { Colors } from "../utils/colors";
import styled from 'styled-components';
import { ManegeActivities } from "../controllers/ActivitiesController.js";
import { CenterContent } from "./CenterContent.js";
import { animations } from 'react-animation'
import { ScrollContainer } from "./ScrollContainer.js";

export const ActivityInfo = ({activity, onUpdate, classroomId}) => {
  const status = getActivityStatus(activity.starts_at, activity.ends_at);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(false)
  }, [activity]);

  const {
    editActivity,
    setEditActivity,
    saveActivity, 
    studentsScore,
    exportarParaExcel
  } = ManegeActivities(activity, classroomId);

  const cancelEdit = () => {
    setEditActivity(activity);
    setEdit(false);
  }

  const saveEdit = async () => {
    const resp = await saveActivity();
    console.log(resp);
    if(resp)
      onUpdate(editActivity);
      setEdit(false);
  }

  return (
    <ContainerStyle>
      <ScrollContainer barLeft>
        <ContainerPaddingStyle>
          <Row>
            <RowItem grow noPadding>
              <h3>{activity.name}</h3>
            </RowItem>
            <RowItem grow noPadding center>
              <StatusBadge status={status}/>
            </RowItem>
            {edit ? 
              <>
                <RowItem noPadding center>
                  <MdCheckStyle onClick={saveEdit} title="Salvar"/>
                </RowItem>
                <RowItem noPadding center>
                  <IoCloseStyle onClick={cancelEdit} title="Cancelar"/>
                </RowItem>
              </>
            :
            <RowItem noPadding center>
              <MdEditStyle onClick={() => setEdit(true)} title="Editar atividade"/>
            </RowItem>
            }
          </Row>
          <Column>
            <text>Data de início: {edit ? 
              <input
                value={editActivity.starts_at ? new Date(editActivity.starts_at).toISOString().slice(0, 16) : null}
                onChange={(ev) => setEditActivity(prevValue => ({...prevValue, starts_at: ev.target.value + ":00Z"}))}
                className={'inputBox'}
                type="datetime-local"
              />
              :
              getDateTime(activity.starts_at)}</text>
            <text>Data de fechamaneto: {edit ? 
              <input
                value={editActivity.ends_at ? new Date(editActivity.ends_at).toISOString().slice(0, 16) : null}
                onChange={(ev) => setEditActivity(prevValue => ({...prevValue, ends_at: ev.target.value}))}
                className={'inputBox'}
                type="datetime-local"
              />
              :
              getDateTime(activity.ends_at)}</text>
            <Row>
              <RowItem grow>
                <text><b>Pontuação dos alunos:</b></text>
              </RowItem>
              <RowItem center>
                <FaFileExportStyle onClick={exportarParaExcel} title="Exportar notas"/>
              </RowItem>
            </Row>
            {studentsScore.map((studentScore) =>
              <StudentScoreItem studentScore={studentScore}/>
            )}
          </Column>
        </ContainerPaddingStyle>
        
      </ScrollContainer>
      <br/>
    </ContainerStyle>
  );
};

export const ContainerStyle = styled.div`
  width: 100%;
`;

export const ContainerPaddingStyle = styled.div`
  padding-right: 16px;
  padding-left: 16px;
`;

export const IoCloseStyle = styled(IoClose)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
  margin-left: 5px;
  transform: translateY(20%);
`;

export const FaFileExportStyle = styled(FaFileExport)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
  margin-left: 5px;
  transform: translateY(20%);
`;

export const MdCheckStyle = styled(MdCheck)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
  margin-left: 5px;
  transform: translateY(20%);
`;

const StudentScoreItem = ({studentScore}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if(studentScore.scores != null){
      setIsOpen(true);
    }
  }

  return (
    <div>
      <StudentScoreItemContainerStyle selected={isOpen}>
        <Row>
          <RowItem grow>
            {studentScore.name}
          </RowItem>
          <RowItem>
            {studentScore.max_score ? studentScore.max_score+'/10' : 'N/A'}
          </RowItem>
          <RowItem center>
            {isOpen ? 
              <FaAngleUpStyle onClick={() => setIsOpen(false)} title="Fechar detalhes"/>
            :
              <FaAngleDownStyle onClick={handleOpen} disabled={studentScore.scores == null} title="Abrir detalhes"/>
            }
          </RowItem>
        </Row>
      </StudentScoreItemContainerStyle>
      {isOpen && studentScore.scores.map((score) => 
        <ScoreItem score={score}/>
      )}
    </div>
  );
};

const StudentScoreItemContainerStyle = styled.div`
  background-color: ${({selected}) => selected ? Colors.LighterGray : Colors.White}; 
  border-radius: 10px;
`;

export const FaAngleDownStyle = styled(FaAngleDown)`
  color: ${({disabled}) => disabled ? Colors.LightGray : Colors.DarkGray}; 
  font-size: 30px;
  cursor: ${({disabled}) => disabled ? 'default' : 'pointer'};
`;

export const FaAngleUpStyle = styled(FaAngleUp)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
`;

const ScoreItem = ({score}) => {
  return (
    <div style={{animation: animations.fadeIn}}>
      <Row>
        <RowItem grow customPadding={10}>
          {getDateTime(score.created_at)}
        </RowItem>
        <RowItem customPadding={10}>
          {score.score}/10
        </RowItem>
      </Row>
    </div>
    
  );
};