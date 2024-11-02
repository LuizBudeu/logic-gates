import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
	const setCookie = useCookies()[1];

  const { login: loginAuth } = useAuth();

  const navigate = useNavigate();

  const login = () => {
    // Set initial error values to empty
    setLoginError('')
      
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setLoginError('Insira um email');
      return
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setLoginError('Insira um email válido')
      return
    }

    if ('' === password) {
      setLoginError('Insira uma senha')
      return
    }

    fetch(process.env.REACT_APP_API_HOSTNAME_PORT + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      headers: {
          "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if ('ok' === r.detail) {
          setCookie("token", r.token);
          loginAuth(r);
          if(r.role == 1){ // Professor
            navigate('/professor/classrooms');
          }else{
            navigate('/simulator');
          }
        } else {
          window.alert('Falha no login, verifique as credenciais');
        }
      })
  }

  return [
      email,
      setEmail,
      password,
      setPassword,
      loginError,
      login,
  ];
};

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [classroomIdentification, setClassroomIdentification] = useState('');
  const [registerError, setRegisterError] = useState('');
	const setCookie = useCookies()[1];
  const { login: loginAuth } = useAuth();

  const navigate = useNavigate();

  const register = () => {
    // Set initial error values to empty
    setRegisterError('')
      
    // Check if the user has entered both fields correctly
    if ('' === name) {
      setRegisterError('Insira um nome');
      return
    }

    if ('' === email) {
      setRegisterError('Insira um email');
      return
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setRegisterError('Insira um email válido')
      return
    }

    if ('' === password) {
      setRegisterError('Insira uma senha')
      return
    }

    if ('' === role) {
      setRegisterError('Escolha um tipo de conta');
      return
    }

    fetch(process.env.REACT_APP_API_HOSTNAME_PORT + '/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role, classroomIdentification }),
      headers: {
          "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if ('ok' === r.detail) {
          setCookie("token", r.token);
          loginAuth(r);
          if(r.role == 1){ // Professor
            navigate('/professor/classrooms');
          }else{
            navigate('/simulator');
          }
          
        } else {
          window.alert('Falha no cadastro, verifique as credenciais');
        }
      })
  }

  return {
      email,
      setEmail,
      password,
      setPassword,
      name,
      setName,
      role, 
      setRole,
      classroomIdentification, 
      setClassroomIdentification,
      registerError,
      register,
  };
};

export const Logout = () => {
  const removeCookie = useCookies()[2];
  const { logout: logoutAuth } = useAuth();

  const navigate = useNavigate();

  const logout = () => {
    removeCookie("token");
    logoutAuth();
    navigate('/login');
  }

  return [
    logout,
  ];
};

