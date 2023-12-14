import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import logoPath from '../../images/logo.svg';

function Register(props) {
  const { user, onChange, onSubmit } = props;
  return (
    <div className="auth">

      <section className="auth__top">
        <a href="/"><img className="auth__logo" src={logoPath} alt="лого" /></a>
        <h1 className="auth__heading">REGISTER signup - Добро пожаловать!</h1>
      </section>

      <form className="auth__form" onSubmit={onSubmit}>
        <span className="auth__input-label">Имя</span>
        <input
          value={user.userName}
          className="auth__input auth__input-name"
          onChange={onChange}
          id="name-input"
          name="userName"
          type="text"
          placeholder=""
          minLength="2"
          maxLength="40"
          required
        />
        <span className="auth__input-name-error"> </span>

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
          className="auth__input auth__input-password"
          value={user.userPassword}
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

        <button className="auth__button" type="submit">Зарегистрироваться</button>
        <p className="auth__secondary-action-txt">
          Уже зарегистрированы?
          <Link to="/signin" className="auth__secondary-action-link">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
