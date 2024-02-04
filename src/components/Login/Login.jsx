import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logoPath from '../../images/logo.svg';
import handleUserFormChange from '../../utils/handleUserFormChange';

function Login(props) {
  const { onSubmit, apiError, onResetApiError } = props;

  const [errors, setErrors] = useState({ userName: '', userEmail: '', userPassword: '' });
  const [userState, setUserState] = useState({ userEmail: '', userPassword: '' });
  // const [isFormValid, setFormValid] = useState(false); // временно заменил стейт на переменную
  const isFormValid = errors.userEmail === '' && errors.userPassword === ''
    && userState.userEmail !== '' && userState.userPassword !== '';

  const loginBtnClassName = `login__button ${!isFormValid ? ' login__button_disabled' : ''}`;

  useEffect(() => {
    onResetApiError(); // эффект очистки ошибки будет вызван только при монтировании компонента
    return () => {
      onResetApiError(); // Этот код очистки будет выполнен при РАЗмонтировании
    };
  }, []);

  const handleChange = (event) => {
    handleUserFormChange(event, userState, setUserState, errors, setErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(userState);
  };

  return (
    <main className="login">

      <section className="login__top">
        <a href="/"><img className="login__logo" src={logoPath} alt="лого" /></a>
        <h1 className="login__heading">Рады видеть!</h1>
      </section>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <span className="login__input-label">E-mail</span>
        <input
          value={userState.userEmail}
          className="login__input auth__input-email"
          onChange={handleChange}
          id="email-input"
          name="userEmail"
          type="text"
          placeholder="E-mail"
        />
        <span className="login__input-error auth__input-error_email">
          {errors.userEmail}
        </span>

        <span className="login__input-label">Пароль</span>
        <input
          value={userState.userPassword}
          className="login__input auth__input-password"
          onChange={handleChange}
          id="password-input"
          name="userPassword"
          type="password"
          placeholder="Пароль"
        />
        <span className="login__input-error auth__input-error_password">
          {errors.userPassword}
        </span>

        <div className="login__buttons-group">
          <span className="login__submit-error">{apiError}</span>
          <button disabled={!isFormValid} className={loginBtnClassName} type="submit">Войти</button>
          <p className="login__secondary-action-txt">
            Ещё не зарегистрированы?
            <Link to="/signup" className="login__secondary-action-link">Регистрация</Link>
          </p>
        </div>

      </form>
    </main>
  );
}

export default Login;
