import styled from 'styled-components'
import { Colors } from "../utils/colors";
import { ActivityStatus, ActivityStatusString } from "../utils/utils";
import { CenterContent } from './CenterContent';

const BadgeColor = (status) => {
  if(status==ActivityStatus.indisponivel){
    return Colors.CancelRed;
  }else if(status==ActivityStatus.pendente){
    return Colors.WarningYellow;
  }else if(status==ActivityStatus.finalizada){
    return Colors.ConfirmBlue;
  }else{
    return Colors.LightGray;
  }
}

const BadgeStyle = styled.div`
    padding: ${({colapsed}) => colapsed ? null : "5px"};
    padding-left: ${({colapsed}) => colapsed ? null : "10px"};
    padding-right: ${({colapsed}) => colapsed ? null : "10px"};
    height: ${({colapsed}) => colapsed ? "20px" : "25px"};
    width: ${({colapsed}) => colapsed ? "20px" : null};
    border-radius: 20px;
    background-color: ${({status}) => BadgeColor(status)};
    color: ${Colors.White};
  `

export const StatusBadge = ({status, colapsed}) => {
  return (
    <BadgeStyle colapsed={colapsed} status={status}>
      <CenterContent>
        {colapsed ? null : ActivityStatusString[status]}
      </CenterContent>
    </BadgeStyle>
  );
};