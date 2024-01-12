import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import logoPath from '../../images/logo.svg';
import handleUserFormChange from '../../utils/handleUserFormChange';

function Register(props) {
  const { user, setUser, onSubmit } = props;
  const [errors, setErrors] = useState({ userName: ' ', userEmail: ' ', userPassword: ' ' });

  const handleChange = (event) => {
    handleUserFormChange(event, user, setUser, errors, setErrors);
  };

  return (
    <main className="auth">

      <section className="auth__top">
        <a href="/"><img className="auth__logo" src={logoPath} alt="лого" /></a>
        <h1 className="auth__heading">Добро пожаловать!</h1>
      </section>

      <form className="auth__form" onSubmit={onSubmit}>
        <span className="auth__input-label">Имя</span>
        <input
          value={user.userName}
          className="auth__input auth__input-name"
          onChange={handleChange}
          id="name-input"
          name="userName"
          type="text"
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-error auth__input-error_userName">
          {errors.userName}
        </span>

        <span className="auth__input-label">E-mail</span>
        <input
          value={user.userEmail}
          className="auth__input auth__input-email"
          onChange={handleChange}
          id="email-input"
          name="userEmail"
          type="email"
          placeholder="E-mail"
          required
        />
        <span className="auth__input-error auth__input-error_email">
          {errors.userEmail}
        </span>

        <span className="auth__input-label">Пароль</span>
        <input
          className="auth__input auth__input-password"
          value={user.userPassword}
          onChange={handleChange}
          id="password-input"
          name="userPassword"
          type="password"
          placeholder="Пароль"
          minLength="4"
          required
        />
        <span className="auth__input-error auth__input-error_password">
          {errors.userPassword}
        </span>

        <button className="auth__button" type="submit">Зарегистрироваться</button>
        <p className="auth__secondary-action-txt">
          Уже зарегистрированы?
          <Link to="/signin" className="auth__secondary-action-link">Войти</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
