import React, { useState } from "react";
import { Auth } from '../controllers/AuthController';
import { Header } from "../components/Header";
import { Background } from "../components/Background";
import { Modal } from "../components/Modal";
import { Container } from "../components/Container";
import { Input, InputButton, WarningLabel } from "../components/Inputs";

export const Login = () => {
	const [email, setEmail, password, setPassword, loginError, login] = Auth();

	return(
		<div>
			<Header/>
			<Background>
				<Container 
					title="Login"
				>
					<Input
						value={email}
						title="Email"
						placeholder="email@email.com"
						onChange={(ev) => setEmail(ev.target.value)}
						className={'inputBox'}
						isMandatory
					/>
					<Input
						value={password}
						title="Senha"
						onChange={(ev) => setPassword(ev.target.value)}
						className={'inputBox'}
						type="password"
						isMandatory
					/>
					<WarningLabel>{loginError}</WarningLabel>
					<InputButton className={'inputButton'} type="button" onClick={login} value={'Entrar'} />
				</Container>
				
			</Background>
		</div>
	)

};