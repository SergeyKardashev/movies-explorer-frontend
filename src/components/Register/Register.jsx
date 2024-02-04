import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import logoPath from '../../images/logo.svg';
import handleUserFormChange from '../../utils/handleUserFormChange';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function Register(props) {
  const { onSubmit, apiError, onResetApiError } = props;

  const currentUserState = useContext(CurrentUserContext);
  const [currentUser, setCurrentUser] = currentUserState;
  const [errors, setErrors] = useState({ userName: '', userEmail: '', userPassword: '' });

  const isFormValid = (errors.userName === '')
    && (errors.userEmail === '')
    && (errors.userPassword === '')
    && (currentUser.userName !== '')
    && (currentUser.userEmail !== '')
    && (currentUser.userPassword !== '');

  const registerBtnClassName = `register__button ${!isFormValid ? ' register__button_disabled' : ''}`;

  useEffect(() => {
    onResetApiError(); // эффект очистки ошибки будет вызван только при монтировании компонента
    return () => {
      onResetApiError(); // Этот код очистки будет выполнен при РАЗмонтировании
    };
  }, []);

  const handleChange = (event) => {
    handleUserFormChange(event, currentUser, setCurrentUser, errors, setErrors);
  };

  return (
    <main className="register">

      <section className="register__top">
        <a href="/"><img className="register__logo" src={logoPath} alt="лого" /></a>
        <h1 className="register__heading">Добро пожаловать!</h1>
      </section>

      <form className="register__form" onSubmit={onSubmit} noValidate>
        <span className="register__input-label">Имя</span>
        <input
          value={currentUser.userName || ''}
          className="register__input register__input-name"
          onChange={handleChange}
          id="name-input"
          name="userName"
          type="text"
          placeholder="Имя"
        />
        <span className="register__input-error register__input-error_userName">
          {errors.userName}
        </span>

        <span className="register__input-label">E-mail</span>
        <input
          value={currentUser.userEmail || ''}
          className="register__input register__input-email"
          onChange={handleChange}
          id="email-input"
          name="userEmail"
          type="text"
          placeholder="E-mail"
        />
        <span className="register__input-error register__input-error_email">
          {errors.userEmail}
        </span>

        <span className="register__input-label">Пароль</span>
        <input
          className="register__input register__input-password"
          value={currentUser.userPassword || ''}
          onChange={handleChange}
          id="password-input"
          name="userPassword"
          type="password"
          placeholder="Пароль"
        />
        <span className="register__input-error register__input-error_password">
          {errors.userPassword}
        </span>

        <div className="register__buttons-group">
          <span className="register__submit-error">{apiError}</span>
          <button disabled={!isFormValid} className={registerBtnClassName} type="submit">Зарегистрироваться</button>
          <p className="register__secondary-action-txt">
            Уже зарегистрированы?
            <Link to="/signin" className="register__secondary-action-link">Войти</Link>
          </p>
        </div>

      </form>
    </main>
  );
}

export default Register;
