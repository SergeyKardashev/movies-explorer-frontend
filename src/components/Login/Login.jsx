import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logoPath from '../../images/logo.svg';

function Login(props) {
  const { user, onSubmit, onChange } = props;
  return (
    <div className="auth">

      <section className="auth__top">
        <a href="/">
          <img className="auth__logo" src={logoPath} alt="лого" />
        </a>
        <h1 className="auth__heading">Рады видеть!</h1>
      </section>

      <form className="auth__form" onSubmit={onSubmit}>
        <span className="auth__input-label">E-mail</span>
        <input
          value={user.userEmail}
          className="auth__input auth__input-email"
          onChange={onChange}
          id="email-input"
          name="userEmail"
          type="email"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-email-error"> </span>

        <span className="auth__input-label">Пароль</span>
        <input
          value={user.userPassword}
          className="auth__input auth__input-password"
          onChange={onChange}
          id="password-input"
          name="userPassword"
          type="password"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-password-error"> </span>

        <button className="auth__button" type="submit">Войти</button>
        <p className="auth__secondary-action-txt">
          Ещё не зарегистрированы?
          <Link to="/signup" className="auth__secondary-action-link">Регистрация</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
