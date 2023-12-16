// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Main from '../Main/Main';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import Header from '../Header/Header';
import MenuPopup from '../MenuPopup/MenuPopup';
import NotFound from '../NotFound/NotFound';
import Footer from '../Footer/Footer';
import Movies from '../Movies/Movies';
import AboutUserBarTmp from '../AboutUserBarTmp/AboutUserBarTmp';
// import Api from '../../utils/api';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });

  const urlWithHeaderFooter = [
    '/',
    '/movies',
    '/saved-movies',
  ];

  const cbCloseMenuPopup = () => {
    setIsMenuPopupOpen(false);
  };
  // ======== ХУКИ НЕЛЬЗЯ В УСЛОВИЯХ ЗАПУСКАТЬ =========
  // const checkIsLoggedIn = () => {
  //   if (localStorage.getItem('user')) {
  //     setIsLoggedIn(true);
  //   }
  // };

  // useEffect(() => {
  //   setIsLoggedIn(localStorage.getItem('user') ? true : false );
  // }, []);

  useEffect(
    () => { setIsLoggedIn(!!localStorage.getItem('user')); },
    [],
  );

  const cbRegister = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'user',
      JSON.stringify(
        { userName: user.userName, userEmail: user.userEmail, userPassword: user.userPassword },
      ),
    );
    setIsLoggedIn(true);
    navigate('/', { replace: false });
  };

  const cbLogin = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'user',
      JSON.stringify(
        { userName: user.userName, userEmail: user.userEmail, userPassword: user.userPassword },
      ),
    );
    setIsLoggedIn(true);
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setUser({
      userName: '',
      userEmail: '',
      userPassword: '',
    });
    navigate('/', { replace: false });
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ userName: user.userName, userEmail: user.userEmail }),
    );
    navigate('/', { replace: true });
  };

  const setUserFromStorage = () => {
    setIsLoggedIn(localStorage.getItem('user'));
    if (localStorage.getItem('user')) {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      const { userEmail, userName, userPassword } = userFromStorage;
      setUser(
        {
          ...user, userName, userEmail, userPassword,
        },
      );
    }
  };

  console.log('Имя: ', user.userName);
  console.log('Мыло: ', user.userEmail);
  console.log('Пароль: ', user.userPassword);

  const getInitialCards = () => {
    console.log('====== starting fetch ======');
    fetch('https://api.nomoreparties.co/beatfilm-movies')
      .then((res) => {
        if (!res.ok) return Promise.reject(new Error(`Ошибка: ${res.status}`));
        return res.json();
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem('initialCards', JSON.stringify({ res }));
      });
  };

  return (
    <>
      <AboutUserBarTmp
        isLoggedIn={isLoggedIn}
        user={user}
        setUserFromStorage={setUserFromStorage}
      />

      <Header
        urlWithHeaderFooter={urlWithHeaderFooter}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movies" element={<Movies onFind={getInitialCards} />} />
        <Route path="/signin" element={<Login user={user} onChange={handleUserFormChange} onSubmit={cbLogin} />} />
        <Route path="/signup" element={<Register user={user} onChange={handleUserFormChange} onSubmit={cbRegister} />} />
        <Route
          path="/profile"
          element={(
            <Profile
              onChange={handleUserFormChange}
              onSubmit={cbUpdateUser}
              onLogOut={cbLogOut}
              user={user}
            />
          )}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithHeaderFooter={urlWithHeaderFooter} />

      <MenuPopup
        onClose={cbCloseMenuPopup}
        isMenuPopupOpen={isMenuPopupOpen}
      />
    </>
  );
}

export default App;
