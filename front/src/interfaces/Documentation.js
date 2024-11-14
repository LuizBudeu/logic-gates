import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { Background } from '../components/Background.js';

export const Documentation = () => {

	return(
		<div className="App">
			<Header/>
			<Background>
				<text>Documentation</text>
			</Background>
		</div>
	)

};