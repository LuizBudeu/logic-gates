import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { ClassroomInfo } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { useParams } from 'react-router';

export const Classroom = (props) => {

	const { id } = useParams();
	const [name, setName, error, getClassroomInfo, saveClassroom ] = ClassroomInfo(id);

	return(
		<div className="App">
			<Header/>
			<Background>
				<input
					value={name}
					placeholder="Nome"
					onChange={(ev) => setName(ev.target.value)}
					className={'inputBox'}
				/>
				<br/>
				<text>{error}</text>
				<input className={'inputButton'} type="button" onClick={saveClassroom} value={'Criar'} />
			</Background>
			
		</div>
	)

};