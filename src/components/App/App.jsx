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
import SavedMovies from '../SavedMovies/SavedMovies';
import clearLocalStorage from '../utils/clearLocalStorage';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });
  const { userName, userEmail, userPassword } = user;

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(
    () => { setIsLoggedIn(!!localStorage.getItem('user')); },
    [],
  );

  const cbRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ userName, userEmail, userPassword }));
    setUser({ userName, userEmail, userPassword });
    setIsLoggedIn(true);
    navigate('/movies', { replace: false });
  };

  const cbLogin = (formData) => {
    let userFromLS = JSON.parse(localStorage.getItem('user'));
    if (!userFromLS) {
      userFromLS = formData;
    } else {
      userFromLS.userEmail = formData.userEmail;
      userFromLS.userPassword = formData.userPassword;
    }
    localStorage.setItem('user', JSON.stringify(userFromLS));
    setUser((state) => ({
      ...state,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
    }));
    setIsLoggedIn(true);
    navigate('/movies', { replace: false });
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    clearLocalStorage();
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    // Обновлю данные юзера, сохранив пароль
    const updatedUser = { ...user, userPassword: userFromStorage.userPassword };
    // Сохраню обновлённые данные в ЛС и обновлю стейт
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    navigate('/', { replace: true });
  };

  return (
    <>
      <Header
        urlWithHeader={urlWithHeader}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/saved-movies" element={<SavedMovies />} />
        <Route
          path="/signin"
          element={<Login onSubmit={cbLogin} />}
        />
        <Route
          path="/signup"
          element={(
            <Register
              user={user}
              setUser={setUser}
              onSubmit={cbRegister}
            />
          )}
        />
        <Route
          path="/profile"
          element={(
            <Profile
              onSubmit={cbUpdateUser}
              onLogOut={cbLogOut}
              user={user}
              setUser={setUser}
            />
          )}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithFooter={urlWithFooter} />

      <MenuPopup
        onClose={cbCloseMenuPopup}
        isMenuPopupOpen={isMenuPopupOpen}
      />
    </>
  );
}

export default App;
