import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ element, roles = [0, 1] }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }else if(!roles.includes(parseInt(user.role))){
    // user does not have access to page
    if(user.role == 0){
      return <Navigate to="/simulator" />;
    }else{
      return <Navigate to="/professor/classrooms" />;
    }
  }
  return element;
};