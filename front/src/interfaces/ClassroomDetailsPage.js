import styled from 'styled-components'
import { Colors } from "../utils/colors";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Header } from "../components/Header.js"
import { ClassroomDetails } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { useParams } from 'react-router';
import { Column } from '../components/Column.js';
import { Row } from '../components/Row.js';
import { RowItem } from '../components/RowItem.js';
import { SubtitleStyle, TitleStyle } from '../utils/typology.js';
import { MdEditStyle } from '../components/MdEditStyle.js';
import { FaPlusCircle } from "react-icons/fa";
import { ActivityItem } from '../components/ActivityItem.js';
import { CenterContent } from '../components/CenterContent.js';
import { ActivityInfo } from '../components/ActivityInfo.js';
import { ScrollContainer } from '../components/ScrollContainer.js';
import { StaticContainer } from '../components/StaticContainer.js';

export const ClassroomDetailsPage = (props) => {
	const navigate = useNavigate();

	const { id } = useParams();
	const { classroom, students, activities, updateActivityOnList, getClassroomDetails } = ClassroomDetails(id);
	const [ selectedActivity, setSelectedActivity ] = useState();

	const copyNewStudentLink = () => {
		navigator.clipboard.writeText(process.env.REACT_APP_FRONT_HOSTNAME_PORT + "/register?id=" + classroom?.identification);
		alert("Link de convite copiado");
	}

	const onActivityUpdate = (activity) => {
		setSelectedActivity(activity);
		updateActivityOnList(activity);
	}

	return(
		<StaticContainer>
			<Header/>
			<Background>
				<CustomColumn>
					<CardBackground>
						<Row>
							<RowItem grow noPadding>
								<Column>
									<div>
										<TitleStyle>{classroom?.name}</TitleStyle>
										<MdEditStyle onClick={() => navigate('/professor/classroom/edit/' + id)} title="Editar turma"/>
									</div>
									<SubtitleStyle>{students.length} alunos</SubtitleStyle>
								</Column>
							</RowItem>
							<RowItem>
								<CustomTitleStyle>Identificador: {classroom?.identification}</CustomTitleStyle>
							</RowItem>
						</Row>
					</CardBackground>
					<CustomRow>
						<RowItem flex={1} display={"null"} noPadding>
							<CardBackground growHeight>
								<Row>
									<CustomTitleStyle>Estudantes</CustomTitleStyle>
									<FaPlusCircleStyle onClick={copyNewStudentLink} title="Convidar alunos"/>
								</Row>
								{students.map((student) => (
									<div>
										<text>{student.student__name}</text>
									</div>
								))}
							</CardBackground>
						</RowItem>
						<RowItem flex={2} display={"null"} noPadding>
							<CardBackground growHeight>
								<Row style={{height: "100%"}}>
									<RowItem flex={1} noPadding>
										<ScrollContainer>
											<Column>
												<CustomTitleStyle>Atividades</CustomTitleStyle>
												{activities.map((activity) => (
													<ActivityItem
														activity={activity}
														onClick={() => setSelectedActivity(activity)}
														selected={activity.id == selectedActivity?.id}
													/>
												))}
											</Column>
										</ScrollContainer>
										
									</RowItem>
									<RowItem noPadding>
										<VerticalLine/>
									</RowItem>
									<RowItem flex={2} noPadding>
									{selectedActivity ? (
											<ActivityInfo 
												activity={selectedActivity} 
												onUpdate={onActivityUpdate}
												classroomId={id}
											/>
										) : (
											<CenterContent>
												<text>Selecione uma atividade</text>
											</CenterContent>
										)}
									</RowItem>
								</Row>
							</CardBackground>
						</RowItem>
					</CustomRow>
				</CustomColumn>
			</Background>
		</StaticContainer>
	)
};

const CardBackground = styled.div`
	background-color: ${Colors.White};
	border-radius: 30px;
	padding: 15px;
	margin: 15px;
	max-height: 100%;
	height: ${({growHeight}) => growHeight ? "calc(100% - 224px);" : "null"};
`

const CustomRow = styled(Row)`
	// height: 100%;
`

const CustomColumn = styled(Column)`
	height: 100%;
`

const CustomTitleStyle = styled(TitleStyle)`
	font-size: 30px;
`

const FaPlusCircleStyle = styled(FaPlusCircle)`
  color: ${Colors.Black}; 
  font-size: 30px; 
  cursor: pointer;
  margin-right: 10px;
  transform: translateY(10%);
`;

export const VerticalLine = styled.div`
  background-color: ${Colors.LighterGray};
  width: 3px;
  height: 90%;
  algin-items: center;
`