import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js'
import CreatePost from './pages/CreatePost.js'
import Post from './pages/Post.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'
import User from './pages/User.js';
import Header from './components/Header.js';
import PageNotFound from './components/PageNotFound.js';
import { AuthContext } from './context/AuthContext.js'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './palettes/basic-palette.css';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const [theme, setTheme] = useState('basic-palette');

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });
  }, []);


  return (
    <div className={`app ${theme}`}>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Header setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/user/:id' element={<User />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;