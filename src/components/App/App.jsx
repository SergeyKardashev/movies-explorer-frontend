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
  createUser, updateUser, login, getUser,
  // saveMovie
  // eslint-disable-next-line no-unused-vars
  getMovies,
} from '../../utils/MainApi';
import { useLocalStorageState as useStorage } from '../../utils/hooks';
// eslint-disable-next-line no-unused-vars
import LOCAL_STORAGE_KEYS from '../../constants/localStorageKeys';

// import {
//   getToken,
//   setToken,
//   removeToken,
// } from '../../utils/token';

function App() {
  const navigate = useNavigate();

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  // стейты через кастомные хуки:
  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);

  // 🔴 Лишнее поле userWord: 'HELLO'
  // eslint-disable-next-line object-curly-newline
  const [user, setUser] = useStorage('user', { userName: '', userEmail: '', userPassword: '', userWord: 'HELLO' });

  // 🔴 initialUser отдаю в пропсы ПРОФИЛЯ чтобы не путать со стейтом юзера
  // и чтоб стартовые данные для cbUpdateUser не менялись при ререндере от инпута
  // но может быть нет смысла его объявлять тут, это же просто переменная,
  // которую только беру из ЛС, я не пишу в ЛС.
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(
    () => { setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn'))); },
    [],
  );

  // const gottenUser = await getUser();
  // 🔵🔵🔵 функция нужна еще ДО авторизации. Зашел на любую страницу - смотрю есть ли токен в ЛС.
  // Если есть - запрашиваю юзера, не заходя на экран входа.
  // Если токена нет в ЛС - показываю экран входа.

  const cbRegister = async (e) => {
    e.preventDefault();
    try {
      // сохраняю свойства изначального стейта, связанного с инпутами в виде переменных
      const { userEmail, userName, userPassword } = user;
      // Регистрирую юзера, получаю айдишник
      const registeredData = await createUser({ userEmail, userName, userPassword });
      const { _id } = registeredData;
      // вхожу, в функции login записывая токен в ЛC
      login({ userEmail, userPassword });
      setUser({ userEmail, userName, userId: _id });
      setIsLoggedIn(true);
      /* 🔴 setIsLoggedIn асинхронный: чтобы направлять только УЖЕ вошедшего,
       а не входящего, в юзэфекте следить за стейтом isLoggedIn и вызывать навигацию */
      navigate('/movies', { replace: false });
    } catch (error) {
      console.log(error); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  const cbLogin = async (loginData) => {
    localStorage.clear(); // чищу ЛС и стейт на случай остатков инфы от другого юзера
    setUser({ userName: '', userEmail: '', userPassword: '' });
    try {
      await login(loginData)
        .then(() => {
          console.log('1й обработчик ЛОГИНА: иду в АПИ за сохранёнками');
          getMovies()
            .then((res) => {
              console.log('Получил массив сохраненок. Пишу в ЛС res:', res);
              JSON.stringify(localStorage.setItem(LOCAL_STORAGE_KEYS.likedMovies, res));
            })
            .catch((err) => {
              console.log('во внешней функции логина получил ошибку из запроса киношек');
              console.error(err);
            });
        })
        .then(() => {
          getUser()
            .then((res) => {
              setUser(res);
              console.log('2й обработчик ЛОГИНА: сохранёнки получил');
              console.log('устанавливаю стейт юзера и IsLoggedIn, направляю на ВСЕ фильмы');
              setIsLoggedIn(true);
              navigate('/movies', { replace: false });
            })
            .catch(console.error);
        });
    } catch (err) {
      console.error(err); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const cbUpdateUser = async (userData) => {
    // шлю правки юзера в АПИ. Если ответ ОК - обновляю юзера хуком (стейт и ЛС) и на главную.
    try {
      const response = await updateUser(userData);
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
      console.log(getUser);
    }
  };

  // const location = useLocation();
  // const protectedRoutes = ['/movies', '/saved-movies', '/profile'];
  // if (!localStorage.getItem('jwt') && protectedRoutes.some((i) => i === location.pathname)) {
  // можно упростить условие - вместо метода SOME применить includes
  // console.log(['joe', 'jane', 'mary'].includes('jane')); // true
  //   console.log('сработал if - токена нет и я на защищенном роуте');
  //   console.log('token', localStorage.getItem('jwt'));
  //   console.log('1я проверка', Boolean(!localStorage.getItem('jwt')));
  //   console.log('2я проверка', protectedRoutes.some((i) => i === location.pathname));
  //   console.log('location', location.pathname);
  //   navigate('/signin', { replace: true });
  // } else {
  //   console.log('сработал else');
  //   console.log('location', location.pathname);
  //   // getUser().then((gottenUser) => { console.log('gotten user:', gottenUser); });
  // }

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
