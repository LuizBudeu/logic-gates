import React, { useEffect } from "react";
import { Register as RegisterController } from '../controllers/AuthController';
import { Header } from "../components/Header";
import { Input, InputButton, InputSelect, WarningLabel } from "../components/Inputs";
import { Container } from "../components/Container";
import { Background } from "../components/Background";

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
			<Background>
				<Container
					title="Cadastro"
				>
					<Input
						value={name}
						title="Nome"
						onChange={(ev) => setName(ev.target.value)}
						className={'inputBox'}
						isMandatory
					/>
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
					<InputSelect title="Tipo de conta" isMandatory onChange={(ev) => setRole(ev.target.value)} value={role} disabled={block_classroom_identification}>
						<option>Escolha uma opção</option>
						<option value="0">Estudante</option>
						<option value="1">Professor</option>
					</InputSelect>
					<br/>
					{role == '0' && 
						<div>
							<Input
								value={classroomIdentification}
								title="Código de turma"
								placeholder="XXXX-XXXX"
								onChange={(ev) => setClassroomIdentification(ev.target.value)}
								className={'inputBox'}
								type="text"
								disabled={block_classroom_identification}
							/>
						</div>
					}
					
					<WarningLabel>{registerError}</WarningLabel>
					<InputButton className={'inputButton'} type="button" onClick={register} value={'Cadastrar'} />
				</Container>
				
			</Background>
		</div>
	)

};