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

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [user, setUser] = useState({ userName: '', userEmail: '', userPassword: '' });
  const { userName, userEmail, userPassword } = user;
  const [formData, setFormData] = useState({
    userName: '', userEmail: '', userPassword: '', movieSearch: '',
  });
  const [errors, setErrors] = useState({});

  const urlWithHeaderFooter = [
    '/',
    '/movies',
    '/saved-movies',
  ];

  const cbCloseMenuPopup = () => { setIsMenuPopupOpen(false); };

  useEffect(
    () => { setIsLoggedIn(!!localStorage.getItem('user')); },
    [],
  );

  const cbRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ userName, userEmail, userPassword }));
    setIsLoggedIn(true);
    navigate('/movies', { replace: false });
  };

  const handleMenuClick = () => { setIsMenuPopupOpen(true); };

  const cbLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('allMovies');
    localStorage.removeItem('likedMovies');
    localStorage.removeItem('filtered');
    localStorage.removeItem('filteredLiked');
    localStorage.removeItem('queryAll');
    localStorage.removeItem('queryLiked');
    localStorage.removeItem('isShortAll');
    localStorage.removeItem('isShortLiked');
    setUser({ userName: '', userEmail: '', userPassword: '' });
    navigate('/', { replace: false });
  };

  const validate = (data) => {
    const newErrors = {};
    if (data.userName.length < 2) {
      newErrors.userName = 'Имя пользователя должно содержать не менее 2 символов';
    } else if (data.userName.length > 40) {
      newErrors.userName = 'Имя пользователя должно содержать не более 40 символов';
    }
    if (!/^\S+@\S+\.\S+$/.test(data.userEmail)) {
      console.log(data.userEmail);
      newErrors.userEmail = `Введите корректный e-mail вместо ${data.userEmail}`;
    }
    if (data.userPassword.length < 4) {
      newErrors.userPassword = 'Пароль должен содержать не менее 4 символов';
    }
    if ((data.movieSearch.length < 1) || (data.movieSearch === ' ')) {
      newErrors.movieSearch = 'Поисковой запрос не может быть пустым или состоять из пробелов';
    }
    console.log(newErrors);
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(formData));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (event.target instanceof HTMLInputElement && event.target.name) {
      setUser({ ...user, [name]: value });
      setFormData({ ...formData, [name]: value });
    }
  };

  const cbLogin = (event) => {
    event.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      localStorage.setItem('user', JSON.stringify({ userEmail, userPassword }));
      setIsLoggedIn(true);
      navigate('/movies', { replace: false });
    }
  };

  const cbUpdateUser = (e) => {
    e.preventDefault();
    handleChange(e);
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, userPassword: userFromStorage.userPassword }));
    navigate('/', { replace: true });
  };

  return (
    <>
      <Header
        urlWithHeaderFooter={urlWithHeaderFooter}
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
      />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/saved-movies" element={<SavedMovies />} />
        <Route
          path="/signin"
          element={(
            <Login
              formData={formData}
              errors={errors}
              onChange={handleChange}
              onSubmit={cbLogin}
            />
          )}
        />
        <Route
          path="/signup"
          element={(
            <Register
              user={user}
              onChange={handleChange}
              onSubmit={cbRegister}
            />
          )}
        />
        <Route
          path="/profile"
          element={(
            <Profile
              onChange={handleChange}
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
