import React, { useEffect, useState } from 'react';
import {
  Route, Routes, useNavigate,
  // useLocation,
} from 'react-router-dom';
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
  createUserApi, updateUserApi, loginApi, getUserApi,
  // saveMovie
  // eslint-disable-next-line no-unused-vars
  getMoviesApi,
} from '../../utils/MainApi';
import { useLocalStorageState as useStorage } from '../../utils/hooks';
import LS_KEYS from '../../constants/localStorageKeys';

import {
  // getToken,
  setToken,
  // removeToken,
} from '../../utils/token';

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

  // const gottenUser = await getUserApi();
  // 🔵🔵🔵 функция нужна еще ДО авторизации. Зашел на любую страницу - смотрю есть ли токен в ЛС.
  // Если есть - запрашиваю юзера, не заходя на экран входа.
  // Если токена нет в ЛС - показываю экран входа.

  const cbRegister = async (e) => {
    e.preventDefault();
    try {
      // сохраняю свойства изначального стейта, связанного с инпутами в виде переменных
      const { userEmail, userName, userPassword } = user;
      // Регистрирую юзера, получаю айдишник
      const registeredData = await createUserApi({ userEmail, userName, userPassword });
      const { _id } = registeredData;
      // вхожу, в функции login записывая токен в ЛC
      loginApi({ userEmail, userPassword });
      setUser({ userEmail, userName, userId: _id });
      setIsLoggedIn(true);
      /* 🔴 т.е. setIsLoggedIn асинхронный: чтобы направлять только УЖЕ вошедшего,а не входящего,
      можно в юзэфекте следить за стейтом isLoggedIn и вызывать навигацию */
      navigate('/movies', { replace: false });
    } catch (err) {
      console.log(err); // 🔴 Если ответ НЕ ок - ошибка над кнопкой.
    }
  };

  const cbLogin = async (loginData) => {
    // 🔴🟠🟡🟢🔵 cbLogin переписать на нормальный асинк вместо цепочки THENов.
    // При вхоже НЕ чищу, а перезаписываю данные юзера если они остались из-за невыхода
    // localStorage.clear(); // чищу ЛС и стейт на случай остатков инфы от другого юзера
    // setUser({ userName: '', userEmail: '', userPassword: '' });
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
              setUser(res);
              setIsLoggedIn(true);
              navigate('/movies', { replace: false });
            })
            .catch(console.error);
        });
    } catch (err) {
      console.error(err); // 🔴 Если ответ НЕ ок - ошибка над кнопкой.
    }
  };

  const cbMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const cbUpdateUser = async (userData) => {
    // шлю правки юзера в АПИ. Если ответ ОК - обновляю юзера хуком (стейт и ЛС) и на главную.
    try {
      const response = await updateUserApi(userData);
      const userToSetState = {
        userEmail: response.email,
        userName: response.name,
        userId: user._id,
      };
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
