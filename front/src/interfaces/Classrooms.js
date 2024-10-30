import styled from 'styled-components';
import React from "react";
import { Header } from "../components/Header.js"
import { Classrooms as ClassroomsController } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { MainTitle } from '../components/MainTitle.js';
import { ClassroomCard } from '../components/ClassroomCard.js';
import { useNavigate } from 'react-router-dom';
import { Row } from '../components/Row.js';
import { RowItem } from '../components/RowItem.js';
import { FaPlusCircle } from "react-icons/fa";
import { Colors } from "../utils/colors";

export const Classrooms = () => {

	const [classrooms, getClassrooms ] = ClassroomsController();
	const navigate = useNavigate();

	return(
		<div className="App">
			<Header/>
			<Background>
				<MainTitle>Minhas Turmas</MainTitle>
				<FaPlusCircleStyle onClick={() => navigate('/professor/classroom/new')} title="Nova turma"/>
				<Row wrap>
					{classrooms.map((classroom) =>
						<RowItem flex={1} center>
							<ClassroomCard classroom={classroom}/>
						</RowItem> 
					)}
				</Row>
			</Background>
		</div>
	)
};

const FaPlusCircleStyle = styled(FaPlusCircle)`
  color: ${Colors.White}; 
  font-size: 30px; 
  cursor: pointer;
  position: absolute;
  margin-left: 10px;
  transform: translateY(50%);
`;