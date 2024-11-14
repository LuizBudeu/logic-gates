import React from "react";
import { Header } from "../components/Header.js"
import { useParams } from 'react-router-dom';
import { SolutionMenager } from '../controllers/ActivitiesController.js';
import { Background } from '../components/Background.js';
import styled from "styled-components";
import { CenterContent } from "../components/CenterContent.js";
import { Colors } from "../utils/colors.js";

export const Solution = () => {
	const { id } = useParams();

	const { activity } = SolutionMenager(id);

	return(
		<div className="App">
			<Header/>
			<Background>
				{activity ? 
					<CenterContent>
						<ImageStyle src={"/images/solutions/"+activity.solution_image} alt="Solução" />
					</CenterContent>
				:
					<CenterContent>
						<TextStyle>Atividade não encontrada ou solução indisponível</TextStyle>
					</CenterContent>
				}
			</Background>
			
		</div>
	)
};

const ImageStyle = styled.img`
  max-height: calc(100vh - 60px);
	max-width: 100vw;
	display: block;
`;

const TextStyle = styled.text`
  color: ${Colors.White};
	font-size: 30px;
`;