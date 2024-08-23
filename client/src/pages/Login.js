import React, { useState, useContext } from 'react'
import axios from 'axios';
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true
        });
        navigate('/');
      }
    });
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <input type='text' placeholder='Name ...' className='login-component' id='login-input-upper' onChange={(event) => { setUserName(event.target.value) }} />
        <input type='password' placeholder='Password ...' className='login-component' id='login-input' onChange={(event) => { setPassword(event.target.value) }} />
        <button onClick={login} className='login-component' id='login-button'>Login</button>
      </div>
      <div className='register-account-container'>
        <div className='create-account-text'>Haven't signed in yet?</div>
        <Link to="/register" className='register-link'>Register</Link>
      </div>
    </div>
  )
}

export default Login
