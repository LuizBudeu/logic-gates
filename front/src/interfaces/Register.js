import React, { useState, useEffect } from "react";
import { Register as RegisterController } from '../controllers/AuthController';
import Form from 'react-bootstrap/Form';
import { Header } from "../components/Header";

export const Register = () => {
	const {email, setEmail, password, setPassword, name, setName, role, setRole, classroomIdentification, setClassroomIdentification, registerError, register} = RegisterController();
	const queryParameters = new URLSearchParams(window.location.search)
  const classroom_identification = queryParameters.get("id");
	const block_classroom_identification = classroom_identification != null;

	useEffect(() => {
    if(block_classroom_identification){
			setRole("0");
			setClassroomIdentification(classroom_identification);
		}
  }, [block_classroom_identification]);

	return(
		<div>
			<Header/>
			<input
				value={name}
				placeholder="Nome"
				onChange={(ev) => setName(ev.target.value)}
				className={'inputBox'}
			/>
			<br/>
			<input
				value={email}
				placeholder="Email"
				onChange={(ev) => setEmail(ev.target.value)}
				className={'inputBox'}
			/>
			<br/>
			<input
				value={password}
				placeholder="Senha"
				onChange={(ev) => setPassword(ev.target.value)}
				className={'inputBox'}
				type="password"
			/>
			<br/>
			<Form.Select onChange={(ev) => setRole(ev.target.value)} value={role} disabled={block_classroom_identification}>
				<option>Escolha uma opção</option>
				<option value="0">Estudante</option>
				<option value="1">Professor</option>
			</Form.Select>
			<br/>
			{role == '0' && 
				<div>
					<input
						value={classroomIdentification}
						placeholder="Código de turma"
						onChange={(ev) => setClassroomIdentification(ev.target.value)}
						className={'inputBox'}
						type="text"
						disabled={block_classroom_identification}
					/>
					<br/>
				</div>
			}
			
			<text>{registerError}</text>
			<br/>
			<input className={'inputButton'} type="button" onClick={register} value={'Cadastrar'} />
		</div>
	)

};