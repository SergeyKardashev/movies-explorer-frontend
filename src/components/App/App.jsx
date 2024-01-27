/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react'; // useRef
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  createUserApi, loginApi, getUserApi, getMoviesApi,
} from '../../utils/MainApi'; // updateUserApi,
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
import { useLocalStorageState as useStorage } from '../../utils/hooks';
import LS_KEYS from '../../constants/localStorageKeys';
import { setToken } from '../../utils/token'; // getToken, // removeToken,
import CurrentUserContext from '../../contexts/CurrentUserContext';
import processUser from '../../utils/processUser';
import ProtectedRouteElement from '../ProtectedRoute/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  // стейты через кастомный хук useStorage:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);
  const currentUserState = useStorage('user', {});
  const [currentUser, setCurrentUser] = currentUserState;

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(() => { setIsLoggedIn(JSON.parse(localStorage.getItem(LS_KEYS.isLoggedIn))); }, []);

  const cbLogin = (loginData) => {
    try {
      loginApi(loginData)
        .then((data) => { setToken(data.token); }) // получил только токен и записал его в ЛС
        .then(() => {
          getMoviesApi()
            .then((res) => { localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(res)); })
            .catch(console.error);
        })
        .then(() => {
          getUserApi() // после входа получаю name, email, _id
            .then((rawUser) => {
              setCurrentUser(processUser(rawUser)); // пишу хуком юзера в стейт и в ЛС
              setIsLoggedIn(true);
              navigate('/movies', { replace: false });
            })
            .catch(console.error);
        });
    } catch (err) { console.error(err); }
  };

  const cbRegister = (e) => {
    e.preventDefault();
    try {
      createUserApi(currentUser)
        .then(cbLogin(currentUser));
    } catch (err) { console.log(err); } // 🔴 Если ответ НЕ ок - ошибка над кнопкой.
  };

  const cbMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.clear();
    navigate('/', { replace: false });
  };

  // const [clientWidth, setClientWidth] = useState(document.documentElement.clientWidth);

  // useEffect(() => {
  //   function handleWindowResize() { setClientWidth(document.documentElement.clientWidth); }
  //   window.addEventListener('resize', handleWindowResize);
  //   return () => { window.removeEventListener('resize', handleWindowResize); };
  // }, []);

  return (
    <CurrentUserContext.Provider value={currentUserState}>
      {/* <h2>{clientWidth}</h2> */}
      <Header urlWithHeader={urlWithHeader} isLoggedIn={isLoggedIn} onMenuClick={cbMenuClick} />

      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/movies" element={<ProtectedRouteElement element={Movies} isLoggedIn={isLoggedIn} />} />
        <Route path="/saved-movies" element={<ProtectedRouteElement element={SavedMovies} isLoggedIn={isLoggedIn} />} />
        <Route path="/profile" element={<ProtectedRouteElement element={Profile} onLogOut={cbLogOut} isLoggedIn={isLoggedIn} />} />

        <Route path="/signin" element={<Login onSubmit={cbLogin} />} />
        <Route path="/signup" element={(<Register setCurrentUser={setCurrentUser} onSubmit={cbRegister} />)} />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithFooter={urlWithFooter} />

      <MenuPopup onClose={cbCloseMenuPopup} isMenuPopupOpen={isMenuPopupOpen} />
    </CurrentUserContext.Provider>
  );
}

export default App;
