import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

	const navigate = useNavigate();

	const onButtonClick = () => {
		// Set initial error values to empty
		setLoginError('')
	
		// Check if the user has entered both fields correctly
		if ('' === email) {
			setLoginError('Insira um email');
			return
		}
	
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setLoginError('Insira um email válido')
			return
		}
	
		if ('' === password) {
			setLoginError('Insira uma senha')
			return
		}
	
		fetch(process.env.REACT_APP_API_HOSTNAME_PORT + '/Login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
			headers: {
					"Content-Type": "application/json",
			},
		})
			.then((r) => r.json())
			.then((r) => {
				if ('Login bem-sucedido' === r.message) {
					navigate('/simulator');
				} else {
					window.alert('Falha no login, verifique as credenciais')
				}
			})

  }

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
			<input className={'inputButton'} type="button" onClick={onButtonClick} value={'Entrar'} />
		</div>
	)

};