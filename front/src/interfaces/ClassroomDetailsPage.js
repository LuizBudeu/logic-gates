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

export const ClassroomDetailsPage = (props) => {
	const navigate = useNavigate();

	const { id } = useParams();
	const [ classroom, students, activities, getClassroomDetails ] = ClassroomDetails(id);

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
								<CustomTitleStyle>Estudantes</CustomTitleStyle>
								{students.map((student) => (
									<div>
										<text>{student.student__name}</text>
									</div>
								))}
							</CardBackground>
						</RowItem>
						<RowItem grow flex={2} display={"null"} noPadding>
							<CardBackground growHeight>
								<CustomTitleStyle>Atividades</CustomTitleStyle>
								{activities.map((activity) => (
									<div>
										<text>{activity.name}</text>
									</div>
								))}
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
		font-size: 20px;
`