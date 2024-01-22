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
import {
  createUserApi, updateUserApi, loginApi, getUserApi, getMoviesApi,
} from '../../utils/MainApi';
import { useLocalStorageState as useStorage } from '../../utils/hooks';
import LS_KEYS from '../../constants/localStorageKeys';
import { setToken } from '../../utils/token'; // getToken, // removeToken,
import CurrentUserContext from '../../contexts/CurrentUserContext';

function App() {
  const navigate = useNavigate();
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  // стейты через кастомные хуки:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);
  const [currentUser, setCurrentUser] = useStorage('user', {});

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(() => { setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn'))); }, []);

  const cbLogin = async (loginData) => {
    try {
      await loginApi(loginData)
        .then((data) => {
          setToken(data.token);
        })
        .then(() => {
          getMoviesApi()
            .then((res) => {
              localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(res));
            })
            .catch(console.error);
        })
        .then(() => {
          getUserApi()
            .then((res) => {
              setCurrentUser(res);
              setIsLoggedIn(true);
              navigate('/movies', { replace: false });
            })
            .catch(console.error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const cbRegister = async (e) => {
    e.preventDefault();
    try {
      // сохраняю свойства изначального стейта, связанного с инпутами в виде переменных
      const { userEmail, userName, userPassword } = currentUser;
      // Регистрирую юзера, получаю айдишник
      const registeredData = await createUserApi({ userEmail, userName, userPassword });
      const { _id } = registeredData;
      // вхожу, в функции login записывая токен в ЛC
      cbLogin({ userEmail, userPassword });
      // loginApi({ userEmail, userPassword });
      setCurrentUser({ userEmail, userName, userId: _id });
      setIsLoggedIn(true);
      /* 🔴 т.е. setIsLoggedIn асинхронный: чтобы направлять только УЖЕ вошедшего,а не входящего,
      можно в юзэфекте следить за стейтом isLoggedIn и вызывать навигацию */
      navigate('/movies', { replace: false });
    } catch (err) {
      console.log(err); // 🔴 Если ответ НЕ ок - ошибка над кнопкой.
    }
  };

  const cbMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setCurrentUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const cbUpdateUser = async (userData) => {
    // шлю правки юзера в АПИ. Если ответ ОК - обновляю юзера хуком (стейт и ЛС) и на главную.
    try {
      const response = await updateUserApi(userData);
      const userToSetState = {
        userEmail: response.email,
        userName: response.name,
        userId: currentUser._id,
      };
      setCurrentUser(userToSetState);
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        urlWithHeader={urlWithHeader}
        isLoggedIn={isLoggedIn}
        onMenuClick={cbMenuClick}
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
            <Register setCurrentUser={setCurrentUser} onSubmit={cbRegister} />
          )}
        />
        <Route
          path="/profile"
          element={(
            <Profile onSubmit={cbUpdateUser} onLogOut={cbLogOut} />
          )}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithFooter={urlWithFooter} />

      <MenuPopup onClose={cbCloseMenuPopup} isMenuPopupOpen={isMenuPopupOpen} />
    </CurrentUserContext.Provider>
  );
}

export default App;
