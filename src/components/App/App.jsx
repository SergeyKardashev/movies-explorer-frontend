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
// import { createUser } from '../utils/MainApi';
import { createUser, updateUser } from '../utils/MainApi';
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
    // 🟢 апи дает юзера с полями name, email, _id, а фронт ждет userName, userEmail
    // 🟢 поэтому нельзя просто записать в стейт юзера переменную fetchedUser

    // 🟢 Можно поштучно обновлять поля стейта
    // 🟡 при таком обновлении стейта в нем хранится пароль. А не должен.
    // 🟡 После сабмита нужно удалять пароль из объекта или сделать undefined
    // user.userEmail = fetchedUser.email; // user.userName = fetchedUser.name;
    // user.userId = fetchedUser._id;
    // delete user.userPassword; // или так user.userPassword = undefined;
    const userFromApi = {
      userEmail: fetchedUser.email,
      userName: fetchedUser.name,
      userId: fetchedUser._id,
    };
    // 🟡 setUser сделан кастомным хуком и пишет в стейт+ЛС. Следующие 2 строки не нужны
    // localStorage.setItem('user', JSON.stringify(fetchedUser));  // setUser(fetchedUser);

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

  // initialUser отдаю в пропсы ПРОФИЛЯ чтобы не путать со стейтом юзера
  // и чтоб стартовые данные для cbUpdateUser не менялись при ререндере от инпута
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

  const cbUpdateUser = async (userData) => {
    // заменил часть функции. ивент ушел в дочку. Из дочки вернется юзер. Его отдам апишке
    // const cbUpdateUser = async (e) => {
    // e.preventDefault();

    // отправляю новые данные юзера в АПИ
    try {
      const response = await updateUser(userData);
      console.log('response (user) is ', response);
      const userToSetState = {
        userEmail: response.email,
        userName: response.name,
        userId: user._id,
      };
      // Если ответ ОК - обновляю стейт юзера (автоматом и ЛС), иду на главную.
      setUser(userToSetState);
      navigate('/', { replace: true });
    } catch (error) {
      // Если ответ НЕ ок - обновляю ошибка над кнопкой, возврат из функции. НЕ иду на главную
      // 🔴 вывести текст ошибки над кнопкой. Создать переменную и отдать ее в компонент
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
