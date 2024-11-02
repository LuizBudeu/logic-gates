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
import { Colors } from "../utils/colors";
import styled from 'styled-components';
import { ManegeActivities } from "../controllers/ActivitiesController.js";

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
    <div style={{width: "100%", padding: "16px"}}>
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
        <text>Pontuação dos alunos:</text>
      </Column>
      <br/>
    </div>
  );
};

export const IoCloseStyle = styled(IoClose)`
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