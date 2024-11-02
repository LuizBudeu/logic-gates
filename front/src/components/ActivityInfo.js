import { getDateTime } from "../utils/date";
import { Row } from "./Row";
import { StatusBadge } from "./StatusBadge";
import { RowItem } from "./RowItem";
import { Column } from "./Column";
import { ActivityStatus } from "../utils/utils";

export const ActivityInfo = ({activity}) => {
  const status = getActivityStatus(activity.starts_at, activity.ends_at);

  return (
    <div style={{width: "100%", padding: "16px"}}>
      <Row>
        <RowItem grow noPadding>
          <h3>{activity.name}</h3>
        </RowItem>
        <RowItem grow noPadding center>
          <StatusBadge status={status}/>
        </RowItem>
      </Row>
      <Column>
        <text>Data de início: {getDateTime(activity.starts_at)}</text>
        <text>Data de fechamaneto: {getDateTime(activity.ends_at)}</text>
        <text>Pontuação dos alunos:</text>
      </Column>
      <br/>
    </div>
  );
};