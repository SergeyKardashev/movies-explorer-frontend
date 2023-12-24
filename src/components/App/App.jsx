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
// import AboutUserBarTmp from '../AboutUserBarTmp/AboutUserBarTmp';
// import Api from '../../utils/api';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });

  const { userName, userEmail, userPassword } = user;

  const urlWithHeader = [
    '/',
    '/movies',
    '/saved-movies',
    '/profile',
  ];

  const urlWithFooter = [
    '/',
    '/movies',
    '/saved-movies',
  ];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(
    () => { setIsLoggedIn(!!localStorage.getItem('user')); },
    [],
  );

  const cbRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ userName, userEmail, userPassword }));
    setIsLoggedIn(true);
    navigate('/movies', { replace: false });
  };

  const cbLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ userEmail, userPassword }));
    setIsLoggedIn(true);
    navigate('/movies', { replace: false });
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('allMovies');
    localStorage.removeItem('likedMovies');
    localStorage.removeItem('filtered');
    localStorage.removeItem('filteredLiked');
    localStorage.removeItem('queryAll');
    localStorage.removeItem('queryLiked');
    localStorage.removeItem('isShortAll');
    localStorage.removeItem('isShortLiked');
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const validate = (name, value) => {
    const regExpName = /^[A-Za-z0-9а-яА-Я_-]+$/;
    if (name === 'userName'
      && (
        (value.length < 2)
        || (value.length > 40)
        || (!regExpName.test(value))
      )) {
      return 'Введите имя. 2-40 знаков. Буквы, цифры, символы -_';
    }
    const regExpEmail = /^\S+@\S+\.\S+$/;
    if (name === 'userEmail' && (!regExpEmail.test(value))) {
      return 'Введите корректный e-mail.';
    }
    if (name === 'userPassword' && value.length < 4) {
      return 'Длина пароля должна быть не менее 4 символов';
    }
    const regExpPassword = /^[A-Za-z0-9!@#$%&*()\-_=+{}[\]?;:,.]+$/;
    if (name === 'userPassword' && (!regExpPassword.test(value))) {
      return 'Допустимы: латиница, цифры, символы !@#$%&*()-_=+[]{}?;:';
    }
    return '';
  };

  const [errors, setErrors] = useState({ userName: ' ', emailError: ' ', userPassword: ' ' });

  const handleUserFormChange = (event) => {
    const { name, value } = event.target; // считываю значение поля.
    // ... логика обновления состояния user ...
    // Убеждаюсь что target - input с атрибутом name
    if (event.target instanceof HTMLInputElement && event.target.name) {
      setUser({ ...user, [name]: value }); // обновляю стейт юзера
    }
    const errorMessage = validate(name, value); // Валидация и...
    setErrors({ ...errors, [name]: errorMessage }); // ... и обновление ошибок
  };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    handleUserFormChange(e); // логика обновления из колбэка
    // ('user') || '{}') вместо ('user') для отказоустойчивости.
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, userPassword: userFromStorage.userPassword }));
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* eslint-disable-next-line max-len */}
      {/* <AboutUserBarTmp isLoggedIn={isLoggedIn} user={user} setUserFromStorage={setUserFromStorage} /> */}

      <Header
        urlWithHeader={urlWithHeader}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/saved-movies" element={<SavedMovies />} />
        <Route path="/signin" element={<Login user={user} errors={errors} onChange={handleUserFormChange} onSubmit={cbLogin} />} />
        <Route path="/signup" element={<Register user={user} errors={errors} onChange={handleUserFormChange} onSubmit={cbRegister} />} />
        <Route
          path="/profile"
          element={(
            <Profile
              onChange={handleUserFormChange}
              onSubmit={cbUpdateUser}
              onLogOut={cbLogOut}
              user={user}
              errors={errors}
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
