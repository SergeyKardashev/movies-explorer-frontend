import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import logoPath from '../../images/logo.svg';

function Register(props) {
  const { onSubmit } = props;
  return (
    <div className="auth">

      <section className="auth__top">
        <img className="auth__logo" src={logoPath} alt="лого" />
        <h1 className="auth__heading">Добро пожаловать!</h1>
      </section>

      <form className="auth__form" onSubmit={onSubmit}>
        <span className="auth__input-label">Имя</span>
        <input
          className="auth__input auth__input-name"
          // value=""
          id="name-input"
          name="name-input"
          type="text"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-name-error"> </span>

        <span className="auth__input-label">E-mail</span>
        <input
          className="auth__input auth__input-email"
          // value=""
          id="email-input"
          name="email-input"
          type="email"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-email-error"> </span>

        <span className="auth__input-label">Пароль</span>
        <input
          className="auth__input auth__input-password"
          // value=""
          id="password-input"
          name="password-input"
          type="password"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-password-error"> </span>

        <button className="auth__button" type="submit">Зарегистрироваться</button>
        <p className="auth__secondary-action-txt">
          Уже зарегистрированы?
          <Link to="/login" className="auth__secondary-action-link">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
