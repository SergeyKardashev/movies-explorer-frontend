// import React, { useState } from 'react';
import React, { useState } from 'react';
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

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  const [user, setUser] = useState({ userName: 'Василий', userEmail: 'pochta@yandex.ru', userPassword: '1234' });

  // кнопка ВОЙТИ В ШАПКЕ: идти /login.
  // кнопка ВОЙТИ на странице логина: сабмит и идти /корень.

  const cbCloseMenuPopup = () => {
    setIsMenuPopupOpen(false);
  };

  const cbRegister = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'user',
      JSON.stringify(
        { userName: user.userName, userEmail: user.userEmail, userPassword: user.userPassword },
      ),
    );
    setIsLoggedIn(true);
    navigate('/', { replace: true });
  };

  const goToLogin = () => {
    navigate('/login', { replace: true });
  };

  const cbLogin = () => {
    navigate('/', { replace: true });
    setIsLoggedIn(true);
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  const cbLogOut = () => {
    navigate('/', { replace: true });
    setIsLoggedIn(false);
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ userName: user.userName, userEmail: user.userEmail }),
    );
  };

  const urlWithHeaderFooter = [
    '/',
    '/movies',
    '/saved-movies',
  ];

  return (
    <>
      <div>{`ник ${user.userName} и емейл ${user.userEmail}`}</div>
      <Header
        urlWithHeaderFooter={urlWithHeaderFooter}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
        onLogin={goToLogin}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<Login onSubmit={cbLogin} />} />
        <Route path="/singup" element={<Register user={user} onChange={handleUserFormChange} onSubmit={cbRegister} />} />
        <Route
          path="/profile"
          element={(
            <Profile
              onChange={handleUserFormChange}
              onSubmit={cbUpdateUser}
              onLogOut={cbLogOut}
              user={user}
            />
          )}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer urlWithHeaderFooter={urlWithHeaderFooter} />

      <MenuPopup
        onClose={cbCloseMenuPopup}
        isMenuPopupOpen={isMenuPopupOpen}
      />
    </>
  );
}

export default App;
