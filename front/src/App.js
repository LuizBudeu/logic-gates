import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './interfaces/Login.js';
import { Simulator } from './interfaces/Simulator.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
