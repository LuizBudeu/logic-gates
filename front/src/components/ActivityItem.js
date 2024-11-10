import styled from 'styled-components';
import { Colors } from "../utils/colors";
// import { ProfissionalIcons } from "../utils/utils";
// import { CustomImage } from "./customImage";
import { RowItem } from "./RowItem";
import { Row } from "./Row";
import { StatusBadge } from "./StatusBadge";
import { CenterContent } from './CenterContent';
import { getActivityStatus } from '../utils/utils';

const ContainerStyle = styled.div`
  background-color: ${({selected}) => selected ? Colors.LighterGray : "null"};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const ActivityItem = ({activity, onClick, selected}) => {
  const status = getActivityStatus(activity.starts_at, activity.ends_at);

  return (
    <ContainerStyle onClick={onClick} selected={selected}>
      <Row>
        <RowItem customPadding={5}>
          <CenterContent>
            <StatusBadge status={status} colapsed/>
          </CenterContent>
        </RowItem>
        <RowItem grow>
          <text>{activity.name}</text>
        </RowItem>
      </Row>
    </ContainerStyle>
  );
};