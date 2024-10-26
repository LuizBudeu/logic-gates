import React, { useState } from "react";
import { Register as RegisterController } from '../controllers/AuthController';

export const Register = () => {
	const [email, setEmail, password, setPassword, name, setName, registerError, register] = RegisterController();

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
			<text>{registerError}</text>
			<br/>
			<input className={'inputButton'} type="button" onClick={register} value={'Cadastrar'} />
		</div>
	)

};