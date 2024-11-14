import styled from 'styled-components';
import { Colors } from "../utils/colors";
import { RowItem } from "./RowItem";
import { Row } from "./Row";
import { ActivityStatus, getActivityStatus } from '../utils/utils';
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { TbFileAnalytics } from "react-icons/tb";
import { StatusBadge } from './StatusBadge';
import { CenterContent } from './CenterContent';
import { Judge } from '../controllers/ActivitiesController';

export const ActivityItemModal = ({activity, sendCircuitToJudge}) => {
  const status = getActivityStatus(activity.starts_at, activity.ends_at);

  return (
    <Row key={"row_activity_"+activity.id}>
      <RowItem grow>
        <OptionsText>
          {activity.order}. {activity.name} 
        </OptionsText>
        {status != ActivityStatus.indisponivel &&
            <a href={activity.description_url} target="_blank" title="Mais detalhes">
              <CenterContent>
                <ExternalIcon/>
              </CenterContent>
            </a>
          }

          {[ActivityStatus.emAndamento, ActivityStatus.naoConfigurada].includes(status) &&
            <div>
              <CenterContent>
                <JudgeIcon onClick={sendCircuitToJudge} title="Validar circuito"/>
              </CenterContent>
            </div>
          }

          {[ActivityStatus.finalizada, ActivityStatus.naoConfigurada].includes(status) &&
            <a href={"/solution/"+activity.id} target="_blank" title="Ver solução">
              <CenterContent>
                <SolutionIcon/>
              </CenterContent>
              
            </a>
          }  
      </RowItem> 
      {status != ActivityStatus.naoConfigurada &&
        <RowItem grow>
          <CenterContent>
            <StatusBadge status={status}/>
          </CenterContent>
        </RowItem> 
      }          
      <RowItem>
        <OptionsText>{activity.score == null ? "N/A" : activity.score+"/10"}</OptionsText>
      </RowItem>
    </Row>
  );
};

const OptionsText = styled.text`
  color: #FFFFFF;
  font-family: 'inter';
  font-size: 20px;
  align-self: center;
  cursor: ${({clickable}) => clickable ? 'pointer' : 'default'};
`;

const Checkbox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #888;
  border-radius: 4px;
  outline: none;
  cursor: default;
  position: relative;
  background-color: transparent;
  padding-left: 0px;

  &:checked {
    background-color: #444;
    border-color: #444;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 6px;
    height: 12px;
    border: solid #00ff55;
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
  }
`;

const ExternalIcon = styled(FaExternalLinkAlt)`
  padding: 10px;
  color: white; 
  font-size: 25px;
  cursor: pointer;
`;

const SolutionIcon = styled(FaEye)`
  padding-right: 5px;
  color: white; 
  font-size: 30px;
  cursor: pointer;
`;

const JudgeIcon = styled(TbFileAnalytics)`
  padding-right: 5px;
  color: white; 
  font-size: 30px;
  cursor: pointer;
`;