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
import createUser from '../utils/MainApi';
import { useLocalStorageState as useStorage } from '../utils/hooks';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useStorage('isLoggedIn', false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [user, setUser] = useStorage('user', { userName: '', userEmail: '', userPassword: '' });

  const urlWithHeader = ['/', '/movies', '/saved-movies', '/profile'];
  const urlWithFooter = ['/', '/movies', '/saved-movies'];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  // при монтировании выставляю стейт значением из хранилища
  useEffect(
    () => { setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn'))); },
    [],
  );

  const cbRegister = async (e) => {
    e.preventDefault();
    const fetchedUser = await createUser(user);
    // 🟢 апи возвращает юзера в объекте вида { name, email, _id }
    // 🟢 А функции фронта ожидают поля userName, userEmail, userPassword
    // 🟢 поэтому нельзя просто записать в стейт юзера переменную fetchedUser

    // 🟢 Можно поштучно обновлять поля стейта
    // 🟡 при таком обновлении стейта в нем хранится пароль. А не должен.
    // 🟡 После сабмита нужно удалять пароль из объекта или сделать undefined
    // user.userEmail = fetchedUser.email;
    // user.userName = fetchedUser.name;
    // user.userId = fetchedUser._id;
    // delete user.userPassword; // или так user.userPassword = undefined;

    // 🟢 Можно перезаписать объект целиком и отдать его в setUser
    const userFromApi = {
      userEmail: fetchedUser.email,
      userName: fetchedUser.name,
      userId: fetchedUser._id,
    };

    // 🟡 setUser сделан кастомным хуком и пишет в стейт+ЛС. Следующие 2 строки не нужны
    // localStorage.setItem('user', JSON.stringify(fetchedUser));
    // setUser(fetchedUser);

    // т.к. стейт асинхронный, консолится старое значение.
    // Переделываю в синхронный способ через стейт-колбэк
    // вместо setUser(userFromApi); делаю:
    // setUser(() => userFromApi);
    // console.log('user', user);

    setUser(userFromApi);
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

  // отдаю в пропсы ПРОФИЛЯ чтобы не путать с юзером
  // и чтоб стартовые данные не менялись при каждом ререндере компонента
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

  const cbUpdateUser = async (userData) => {
    // заменил часть функции. ивент ушел в дочку. Из дочки вернется юзер. Его отдам апишке
    // const cbUpdateUser = async (e) => {
    // e.preventDefault();
    const mainApiUrl = 'http://localhost:3000';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWExMjAyYWFhNTk4MDQyNDgzNjdjMTUiLCJpYXQiOjE3MDUwNTg1NDEsImV4cCI6MTcwNTY2MzM0MX0.WaPGYMDmTNfsBeR_LrUs1M3JkEZTAzKXg86qeBr_tAA';
    // отправляю нового юзера в АПИ, получаю ответ.
    try {
      const response = await fetch(`${mainApiUrl}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userData.userEmail,
          name: userData.userName,
        }),
      }).then((res) => {
        if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
        return res.json();
      });

      console.log('response (user) is ', response);
      const userToSetState = {
        userEmail: response.email,
        userName: response.name,
        userId: user._id,
      };
      setUser(userToSetState);
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
      // 🔴 вывести текст ошибки над кнопкой. Создать переменную и отдать ее в компонент
    }

    // Вынести обращение к АПИшке во внешнюю функцию. Тут будет так:
    // const response = await updateUser(user);

    // Если ОК - обновляю стейт юзера (автоматом и ЛС), иду на главную.
    // Если НЕ ок - обновляю ошибка над кнопкой, возврат из функции. НЕ иду на главную

    // старый вариант функции:
    // e.preventDefault();
    // const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    // // Обновлю данные юзера, сохранив пароль
    // const updatedUser = { ...user, userPassword: userFromStorage.userPassword };
    // // Сохраню обновлённые данные в стейт и ЛС кастомным хуком
    // // localStorage.setItem('user', JSON.stringify(updatedUser));
    // setUser(updatedUser);
    // navigate('/', { replace: true });
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
