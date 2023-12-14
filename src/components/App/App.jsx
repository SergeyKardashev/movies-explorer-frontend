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

  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });

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
    navigate('/', { replace: false });
  };

  const cbLogin = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'user',
      JSON.stringify(
        { userName: user.userName, userEmail: user.userEmail, userPassword: user.userPassword },
      ),
    );
    setIsLoggedIn(true);
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setUser({
      userName: '',
      userEmail: '',
      userPassword: '',
    });
    navigate('/', { replace: false });
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
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ userName: user.userName, userEmail: user.userEmail }),
    );
    navigate('/', { replace: true });
  };

  const urlWithHeaderFooter = [
    '/',
    '/movies',
    '/saved-movies',
  ];

  return (
    <>
      <div style={{ padding: 10, color: 'red' }}>{` ИМЯ: ${user.userName}. ПОЧТА: ${user.userEmail}. ПАРОЛЬ: ${user.userPassword}`}</div>
      <Header
        urlWithHeaderFooter={urlWithHeaderFooter}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<Login user={user} onChange={handleUserFormChange} onSubmit={cbLogin} />} />
        <Route path="/signup" element={<Register user={user} onChange={handleUserFormChange} onSubmit={cbRegister} />} />
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
