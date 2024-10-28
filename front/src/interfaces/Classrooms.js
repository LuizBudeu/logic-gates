import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { Classrooms as ClassroomsController } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { useNavigate } from 'react-router-dom';

export const Classrooms = () => {

	const [classrooms, getClassrooms ] = ClassroomsController();
	const navigate = useNavigate();

	return(
		<div className="App">
			<Header/>
			<Background>
				<text>Turmas</text>
				<button onClick={() => navigate('/professor/classroom/new')}>Nova turma</button>
				{classrooms.map((classroom) => 
					<div>
						<text>{classroom.name}</text>
						<button onClick={() => navigate('/professor/classroom/edit/' + classroom.id)}>Editar turma</button>
					</div>
				)}
			</Background>
			
		</div>
	)

};