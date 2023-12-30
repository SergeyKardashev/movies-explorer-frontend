import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import logoPath from '../../images/logo.svg';
import handleUserFormChange from '../utils/handleUserFormChange';

function Login(props) {
  const { onSubmit } = props;
  const [errors, setErrors] = useState({ userName: ' ', userEmail: ' ', userPassword: ' ' });
  const [formData, setFormData] = useState({ userEmail: '', userPassword: '' });

  const handleChange = (event) => {
    handleUserFormChange(event, formData, setFormData, errors, setErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userEmail || !formData.userPassword) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <main className="auth">

      <section className="auth__top">
        <a href="/"><img className="auth__logo" src={logoPath} alt="лого" /></a>
        <h1 className="auth__heading">Рады видеть!</h1>
      </section>

      <form className="auth__form" onSubmit={handleSubmit}>
        <span className="auth__input-label">E-mail</span>
        <input
          value={formData.userEmail}
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
          value={formData.userPassword}
          className="auth__input auth__input-password"
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

        <button className="auth__button" type="submit">Войти</button>
        <p className="auth__secondary-action-txt">
          Ещё не зарегистрированы?
          <Link to="/signup" className="auth__secondary-action-link">Регистрация</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
