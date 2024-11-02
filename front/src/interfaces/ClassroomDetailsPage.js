import styled from 'styled-components'
import { Colors } from "../utils/colors";
import React from "react";
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

export const ClassroomDetailsPage = (props) => {
	const navigate = useNavigate();

	const { id } = useParams();
	const [ classroom, students, activities, getClassroomDetails ] = ClassroomDetails(id);

	const copyNewStudentLink = () => {
		navigator.clipboard.writeText(process.env.REACT_APP_FRONT_HOSTNAME_PORT + "/register?id=" + classroom?.identification);
		alert("Link de convite copiado");
	}

	return(
		<div>
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
						<RowItem grow flex={1} display={"null"} noPadding>
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
						<RowItem grow flex={2} display={"null"} noPadding>
							<CardBackground growHeight>
								<Row style={{height: "100%"}}>
									<RowItem flex={1}>
										<Column>
											<CustomTitleStyle>Atividades</CustomTitleStyle>
											{activities.map((activity) => (
												<div>
													<text>{activity.name}</text>
												</div>
											))}
										</Column>
									</RowItem>
									<RowItem noPadding>
										<VerticalLine/>
									</RowItem>
									<RowItem flex={2}>

									</RowItem>
								</Row>
							</CardBackground>
						</RowItem>
					</CustomRow>
				</CustomColumn>
			</Background>
		</div>
	)
};

export const CardBackground = styled.div`
	background-color: ${Colors.White};
	border-radius: 30px;
	padding: 15px;
	margin: 15px;
	max-height: 100%;
	height: ${({growHeight}) => growHeight ? "calc(100% - 60px);" : "null"};
`

export const CustomRow = styled(Row)`
	height: 100%;
`

export const CustomColumn = styled(Column)`
	height: 100%;
`

export const CustomTitleStyle = styled(TitleStyle)`
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