import React, { useState } from "react";
import { Register as RegisterController } from '../controllers/AuthController';
import Form from 'react-bootstrap/Form';

export const Register = () => {
	const [email, setEmail, password, setPassword, name, setName, role, setRole, registerError, register] = RegisterController();

	return(
		<div>
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
			<Form.Select onChange={(ev) => setRole(ev.target.value)} value={role}>
				<option>Escolha uma opção</option>
				<option value="0">Estudante</option>
				<option value="1">Professor</option>
			</Form.Select>
			<br/>
			<text>{registerError}</text>
			<br/>
			<input className={'inputButton'} type="button" onClick={register} value={'Cadastrar'} />
		</div>
	)

};