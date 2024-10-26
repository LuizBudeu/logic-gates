import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { CustomCanvas } from "../components/Canvas.js"
import { UserInfo } from "../controllers/UserController.js"
import { StudentActivities } from "../controllers/ActivitiesController.js"

export const Simulator = () => {

	const [user, getUserInfo] = UserInfo();
	const [activities, getActivities] = StudentActivities();
	return(
		<div className="App">
			<Header user={user} activities={activities}/>
			<CustomCanvas/>
		</div>
	)

};