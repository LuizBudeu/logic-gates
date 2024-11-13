import { useRoutes, Navigate } from "react-router-dom";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Login } from '../interfaces/Login.js';
import { Register } from '../interfaces/Register.js';
import { Simulator } from '../interfaces/Simulator.js';
import { Classrooms } from '../interfaces/Classrooms.js';
import { Classroom } from '../interfaces/Classroom.js';
import { ClassroomDetailsPage } from '../interfaces/ClassroomDetailsPage.js';
import { Documentation } from "../interfaces/Documentation.js";
import { Solution } from "../interfaces/Solution.js";

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
        path: "/docs",
        element: <ProtectedRoute element={<Documentation />} />
      },
      {
        path: "/solution/:id",
        element: <ProtectedRoute element={<Solution />} />
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
        path: "/professor/classroom/details/:id",
        element: <ProtectedRoute roles={[1]} element={<ClassroomDetailsPage />} />
      },
      {
        path: "*",
        element: <ProtectedRoute element={<Navigate to="/professor/classrooms" replace />} />
      },
    ]);

    return routes;
}