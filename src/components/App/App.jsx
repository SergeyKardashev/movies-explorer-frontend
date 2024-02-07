import React, { useEffect, useState } from 'react'; // useRef
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  createUserApi, getTokenApi, getUserApi, getMoviesApi,
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

  // // // // //
  //  СТЕЙТЫ  //
  // // // // //

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false); // Открыто ли гамбургер-меню
  const [apiError, setApiError] = useState(''); // Текст ошибки от апи над кнопкой в формах юзера

  // Стейты через кастомный хук useStorage, дублирующий сохранение в стейт и в локальное хранилище:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);

  // Специально сделал в 2 строки (дефрагментация второй строкой)
  // чтобы передать в контекст одно значение, а не массив. Иначе линтер ругается.
  const currentUserState = useStorage('user', {});
  const [currentUser, setCurrentUser] = currentUserState;

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  // // // // // //
  //   ФУНКЦИИ   //
  // // // // // //

  const cbCloseMenuPopup = () => {
    setIsMenuPopupOpen(false);
  };

  const resetApiError = () => {
    setApiError('');
  };

  const getAndSaveToken = async (loginData) => {
    // Выполняю вход и получаю токен, сохраняю токен в ЛС и стейт
    try {
      const loginResponse = await getTokenApi(loginData);
      setToken(loginResponse.token);
    } catch (error) {
      setApiError((error.message));
      throw error; // Проброс ошибки наверх для обработки в handleLogin
    }
  };

  const getAndSetUser = async () => {
    // Получаю данные юзера, пишу в ЛС и стейт
    try {
      const rawUser = await getUserApi();
      setCurrentUser(processUser(rawUser));
    } catch (error) {
      setApiError((error.message));
      throw error; // Проброс ошибки наверх для обработки в handleLogin
    }
  };

  const getAndSaveLikedMovies = async () => {
    // Получаю лайкнутые фильмы и пишу в ЛС
    try {
      const movies = await getMoviesApi();
      localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(movies));
    } catch (error) {
      setApiError((error.message));
      throw error; // Проброс ошибки наверх для обработки в handleLogin
    }
  };

  const handleLogin = async (loginData) => {
    try {
      await getAndSaveToken(loginData); // Получаю токен
      await getAndSetUser(); // Получаю юзера, пишу в ЛС и стейт только после получения токена
      setIsLoggedIn(true); // Обновляю стейт входа только после получения данных юзера
      await getAndSaveLikedMovies(); // Получаю лайкнутые фильмы и пишу их в ЛС
      navigate('/movies', { replace: false }); // Перенаправляю только после успешного выполнения всех предыдущих шагов
    } catch (error) {
      console.error('Не удалось осуществить вход: ', error);
      setApiError((error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Попытка создать юзера. Если вызовет ошибку - cbLogin не выполнится.
      await createUserApi(currentUser);
    } catch (error) {
      console.error('Не удалось зарегистрироваться: ', error);
      setApiError(error.message);
      return; // !!! Важно! Досрочный выход из функции, если создание юзера не удалось.
    }
    // Выполнение входа только после успешной регистрации.
    await handleLogin(currentUser);
    // Т.к. в cbLogin все функции со своими try-catch - здесь try-catch не нужен.
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.clear();
    navigate('/', { replace: false });
  };

  // // // // // //
  //   ЭФФЕКТЫ   //
  // // // // // //

  useEffect(() => {
    setIsLoggedIn(JSON.parse(localStorage.getItem(LS_KEYS.isLoggedIn)));
  }, []);

  // при монтировании проверяю токен. Если не валидный - выхожу. Сработает при перезагрузке.
  useEffect(() => {
    // запрашиваю данные юзера чтобы валидировать токен. Функция берет токен из ЛС и шлёт в АПИ
    getUserApi().catch((error) => {
      if (error.status === 401) {
        handleLogOut(); // токен не валидный или отсутствует. Выхожу и иду на главную
      }
    });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUserState}>
      <Header urlWithHeader={urlWithHeader} isLoggedIn={isLoggedIn} onMenuClick={handleMenuClick} />

      <Routes>
        <Route path="/" element={<Main />} />

        {/* 🟢 MOVIES */}
        <Route
          path="/movies"
          element={(
            <ProtectedRouteElement
              element={Movies}
              allowedToSee={isLoggedIn}
            />
          )}
        />

        {/* 🟢 SAVED MOVIES */}
        <Route
          path="/saved-movies"
          element={(
            <ProtectedRouteElement
              element={SavedMovies}
              allowedToSee={isLoggedIn}
            />
          )}
        />

        {/* 🟢 PROFILE */}
        <Route
          path="/profile"
          element={(
            <ProtectedRouteElement
              element={Profile}
              onLogOut={handleLogOut}
              allowedToSee={isLoggedIn}
            />
          )}
        />

        {/* 🟢 LOGIN */}
        <Route
          path="/signin"
          element={(
            <ProtectedRouteElement
              element={Login}
              onSubmit={handleLogin}
              apiError={apiError}
              onResetApiError={resetApiError}
              allowedToSee={!isLoggedIn}
              redirectTo="/movies"
            />
          )}
        />

        {/* 🟢 REGISTER */}
        <Route
          path="/signup"
          element={(
            <ProtectedRouteElement
              element={Register}
              setCurrentUser={setCurrentUser}
              onSubmit={handleRegister}
              apiError={apiError}
              onResetApiError={resetApiError}
              allowedToSee={!isLoggedIn}
              redirectTo="/movies"
            />
          )}
        />
        {/* 🟢 404 */}
        <Route path="/*" element={<NotFound />} />

      </Routes>

      <Footer urlWithFooter={urlWithFooter} />

      <MenuPopup onClose={cbCloseMenuPopup} isMenuPopupOpen={isMenuPopupOpen} />
    </CurrentUserContext.Provider>
  );
}

export default App;
