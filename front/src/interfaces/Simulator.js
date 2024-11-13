import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { CustomCanvas } from "../components/Canvas.js"

export const Simulator = () => {

	return(
		<div className="App">
			<Header/>
			<CustomCanvas/>
		</div>
	)

};