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
// import AboutUserBarTmp from '../AboutUserBarTmp/AboutUserBarTmp';
// import Api from '../../utils/api';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });

  const { userName, userEmail, userPassword } = user;

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
    localStorage.setItem('user', JSON.stringify({ userName, userEmail, userPassword }));
    setIsLoggedIn(true);
    navigate('/', { replace: false });
  };

  const cbLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ userEmail, userPassword }));
    setIsLoggedIn(true);
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const handleUserFormChange = (e) => {
    // Убедимся, что e.target является элементом input и имеет атрибут name
    if (e.target instanceof HTMLInputElement && e.target.name) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // const cbUpdateUser = (e) => {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   setUser({
  //     ...user,
  //     [name]: value,
  //   });
  //   const userFromStorage = localStorage.getItem('user');
  //   localStorage.setItem('user', JSON.stringify(
  // { userName, userEmail, userPassword: userFromStorage.userPassword }));
  //   navigate('/', { replace: true });
  // };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    handleUserFormChange(e); // используем логику обновления из внешней функции
    // ('user') || '{}') вместо просто ('user') для отказоустойчивости.
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, userPassword: userFromStorage.userPassword }));
    navigate('/', { replace: true });
  };

  // const setUserFromStorage = () => {
  //   setIsLoggedIn(localStorage.getItem('user'));
  //   if (localStorage.getItem('user')) {
  //     const userFromStorage = JSON.parse(localStorage.getItem('user'));
  //     const { userEmail, userName, userPassword } = userFromStorage;
  //     setUser(
  //       {
  //         ...user, userName, userEmail, userPassword,
  //       },
  //     );
  //   }
  // };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Name: ', user.userName, ' Mail: ', user.userEmail, ' Pass', user.userPassword);
  }, [user]);

  return (
    <>
      {/* eslint-disable-next-line max-len */}
      {/* <AboutUserBarTmp isLoggedIn={isLoggedIn} user={user} setUserFromStorage={setUserFromStorage} /> */}

      <Header
        urlWithHeaderFooter={urlWithHeaderFooter}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movies" element={<Movies />} />
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
