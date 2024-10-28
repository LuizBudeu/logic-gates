import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './interfaces/Login.js';
import { Register } from './interfaces/Register.js';
import { Simulator } from './interfaces/Simulator.js';
import { Classrooms } from './interfaces/Classrooms.js';
import { Classroom } from './interfaces/Classroom.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/professor/classrooms" element={<Classrooms />} />
        <Route path="/professor/classroom/new" element={<Classroom />} />
        <Route path="/professor/classroom/edit/:id" element={<Classroom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
