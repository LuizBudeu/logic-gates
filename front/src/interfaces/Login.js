import React, { useState } from "react";
import { Auth } from '../controllers/AuthController';

export const Login = () => {
	const [email, setEmail, password, setPassword, loginError, login] = Auth();

	return(
		<div>
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
			<text>{loginError}</text>
			<br/>
			<input className={'inputButton'} type="button" onClick={login} value={'Entrar'} />
		</div>
	)

};