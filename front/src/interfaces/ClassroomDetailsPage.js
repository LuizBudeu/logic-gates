import logo from './../logo.svg';
import React from "react";
import { Header } from "../components/Header.js"
import { ClassroomDetails } from "../controllers/ClassroomController.js"
import { Background } from '../components/Background.js';
import { useParams } from 'react-router';

export const ClassroomDetailsPage = (props) => {

	const { id } = useParams();
	const [ classroom, students, activities, getClassroomDetails ] = ClassroomDetails(id);

	return(
		<div className="App">
			<Header/>
			<Background>
				<text>{classroom?.name}</text>
				<br/>
				<text>Estudantes:</text>
				{students.map((student) => (
					<div>
						<text>{student.student__name}</text>
					</div>
				))}
				<br/>
				<text>Atividades:</text>
				{activities.map((activity) => (
					<div>
						<text>{activity.name}</text>
					</div>
				))}
			</Background>
			
		</div>
	)

};