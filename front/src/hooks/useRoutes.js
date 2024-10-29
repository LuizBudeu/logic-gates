import { useRoutes, Navigate } from "react-router-dom";
import { Login } from '../interfaces/Login.js';
import { Register } from '../interfaces/Register.js';
import { Simulator } from '../interfaces/Simulator.js';
import { Classrooms } from '../interfaces/Classrooms.js';
import { Classroom } from '../interfaces/Classroom.js';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function Router() {
    let routes = useRoutes([
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/simulator",
        element: <ProtectedRoute element={<Simulator />} />
      },
      {
        path: "/professor/classrooms",
        element: <ProtectedRoute roles={[1]} element={<Classrooms />} />
      },
      {
        path: "/professor/classroom/new",
        element: <ProtectedRoute roles={[1]} element={<Classroom />} />
      },
      {
        path: "/professor/classroom/edit/:id",
        element: <ProtectedRoute roles={[1]} element={<Classroom />} />
      },
      {
        path: "*",
        element: <ProtectedRoute element={<Navigate to="/professor/classrooms" replace />} />
      },
    ]);

    return routes;
}