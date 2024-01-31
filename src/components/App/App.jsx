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
import useStorage from '../../utils/hooks';
import LS_KEYS from '../../constants/localStorageKeys';
import { setToken } from '../../utils/token'; // getToken, // removeToken,
import CurrentUserContext from '../../contexts/CurrentUserContext';
import processUser from '../../utils/processUser';
import ProtectedRouteElement from '../ProtectedRoute/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [apiError, setApiError] = useState('');

  // стейты через кастомный хук useStorage:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);
  const currentUserState = useStorage('user', {});
  const [currentUser, setCurrentUser] = currentUserState;

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(() => { setIsLoggedIn(JSON.parse(localStorage.getItem(LS_KEYS.isLoggedIn))); }, []);

  const resetApiError = () => {
    setApiError('');
  };

  async function loginUser(loginData) {
    // Выполняю вход и получаю токен, сохраняю токен в ЛС и стейт
    const loginResponse = await loginApi(loginData);
    setToken(loginResponse.token);
  }

  async function fetchAndSaveLikedMovies() {
    // Получаю лайкнутые фильмы и пишу в ЛС
    const movies = await getMoviesApi();
    localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(movies));
  }

  async function fetchAndSetUserData() {
    // Получаю данные юзера, пишу в ЛС и стейт
    const rawUser = await getUserApi();
    setCurrentUser(processUser(rawUser));
  }

  const cbLogin = async (loginData) => {
    try {
      await loginUser(loginData);
      await fetchAndSaveLikedMovies();
      await fetchAndSetUserData();
      setIsLoggedIn(true);
      navigate('/movies', { replace: false });
    } catch (error) {
      setApiError(error.message);
    }
  };

  const cbRegister = (e) => {
    e.preventDefault();
    try {
      createUserApi(currentUser)
        .then(() => cbLogin(currentUser));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const cbMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.clear();
    navigate('/', { replace: false });
  };

  return (
    <CurrentUserContext.Provider value={currentUserState}>
      <Header urlWithHeader={urlWithHeader} isLoggedIn={isLoggedIn} onMenuClick={cbMenuClick} />

      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/movies" element={<ProtectedRouteElement element={Movies} isLoggedIn={isLoggedIn} />} />
        <Route path="/saved-movies" element={<ProtectedRouteElement element={SavedMovies} isLoggedIn={isLoggedIn} />} />
        <Route path="/profile" element={<ProtectedRouteElement element={Profile} onLogOut={cbLogOut} isLoggedIn={isLoggedIn} />} />

        <Route path="/signin" element={<Login onSubmit={cbLogin} apiError={apiError} onResetApiError={resetApiError} />} />
        <Route path="/signup" element={(<Register setCurrentUser={setCurrentUser} onSubmit={cbRegister} apiError={apiError} onResetApiError={resetApiError} />)} />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithFooter={urlWithFooter} />

      <MenuPopup onClose={cbCloseMenuPopup} isMenuPopupOpen={isMenuPopupOpen} />
    </CurrentUserContext.Provider>
  );
}

export default App;
