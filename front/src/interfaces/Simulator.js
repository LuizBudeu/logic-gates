import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { UserInfo } from "../controllers/UserController.js"
import { StudentActivities } from "../controllers/ActivitiesController.js"

export const Simulator = () => {

	const [user, getUserInfo] = UserInfo();
	const [activities, getActivities] = StudentActivities();
	return(
		<div className="App">
			<Header user={user} activities={activities}/>
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	)

};