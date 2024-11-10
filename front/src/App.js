import './App.css';
import { BrowserRouter } from "react-router-dom";
import Router from "./hooks/useRoutes.js";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
