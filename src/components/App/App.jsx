// import React, { useState } from 'react';
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Main from '../Main/Main';
import Login from '../Login/Login';
import Register from '../Register/Register';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cbLogin = () => {
    navigate('/', { replace: true });
    setIsLoggedIn(true);
  };

  const cbRegister = () => {
    navigate('/', { replace: true });
    setIsLoggedIn(true);
  };

  const cbLogOut = () => {
    navigate('/', { replace: true });
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route path="/" element={<Main isLoggedIn={isLoggedIn} onLogOut={cbLogOut} />} />
      <Route path="/login" element={<Login onSubmit={cbLogin} />} />
      <Route path="/register" element={<Register onSubmit={cbRegister} />} />
    </Routes>
  );
}

export default App;
