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
// import clearLocalStorage from '../utils/clearLocalStorage';
// import { createUser } from '../utils/MainApi';
import { createUser, updateUser, login } from '../utils/MainApi';
import { useLocalStorageState as useStorage } from '../utils/hooks';

function App() {
  const navigate = useNavigate();

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  // стейты через кастомные хуки:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);
  const [user, setUser] = useStorage('user', { userName: '', userEmail: '', userPassword: '' });

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(
    () => { setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn'))); },
    [],
  );

  const cbRegister = async (e) => {
    e.preventDefault();
    try {
      const fetchedUser = await createUser(user);
      const userFromApi = {
        userEmail: fetchedUser.email,
        userName: fetchedUser.name,
        userId: fetchedUser._id,
      };
      setUser(userFromApi);
      setIsLoggedIn(true);
      navigate('/movies', { replace: false });
    } catch (error) {
      console.log(error); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  const cbLogin = async (loginData) => {
    try {
      await login(loginData);
      setUser(() => ({ userEmail: loginData.userEmail, userPassword: loginData.userPassword }));
      setIsLoggedIn(true);
      navigate('/movies', { replace: false });
    } catch (error) {
      console.log(error); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  // initialUser отдаю в пропсы ПРОФИЛЯ чтобы не путать со стейтом юзера
  // и чтоб стартовые данные для cbUpdateUser не менялись при ререндере от инпута
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

  const cbUpdateUser = async (userData) => {
    // отправляю новые данные юзера в АПИ
    try {
      const response = await updateUser(userData);
      // console.log('response (user) is ', response);
      const userToSetState = {
        userEmail: response.email,
        userName: response.name,
        userId: user._id,
      };
      // Если ответ ОК - обновляю стейт юзера (автоматом и ЛС), иду на главную.
      setUser(userToSetState);
      navigate('/', { replace: true });
    } catch (error) {
      // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
      console.log(error);
    }
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
              // user={user}
              // setUser={setUser}
              initialUser={initialUser}
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
