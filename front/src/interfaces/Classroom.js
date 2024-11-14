import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { ClassroomInfo } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { useParams } from 'react-router';
import { Input, InputButton, WarningLabel } from '../components/Inputs.js';
import { Container } from '../components/Container.js';

export const Classroom = (props) => {

	const { id } = useParams();
	const [name, setName, error, getClassroomInfo, saveClassroom ] = ClassroomInfo(id);

	return(
		<div className="App">
			<Header/>
			<Background>
				<Container 
					title={id ? "Editar turma" : "Nova turma"}
				>				
					<Input
						value={name}
						title="Nome"
						onChange={(ev) => setName(ev.target.value)}
						className={'inputBox'}
					/>
					<WarningLabel>{error}</WarningLabel>
					<InputButton className={'inputButton'} type="button" onClick={saveClassroom} value={'Criar'} />
				</Container>
			</Background>	
		</div>
	)

};