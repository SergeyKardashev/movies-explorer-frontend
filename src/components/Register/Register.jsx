import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import logoPath from '../../images/logo.svg';
import handleUserFormChange from '../../utils/handleUserFormChange';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function Register(props) {
  console.log('Register');
  const {
    onSubmit,
    apiError,
    onResetApiError,
  } = props;

  // // // // //
  //  СТЕЙТЫ  //
  // // // // //

  const currentUserState = useContext(CurrentUserContext);
  const [currentUser, setCurrentUser] = currentUserState;
  const [errors, setErrors] = useState({ userName: '', userEmail: '', userPassword: '' });

  const [isEditMode, setIsEditMode] = useState(true);// стейт для блокировки форм при запросах к АПИ

  const isFormValid = (errors.userName === '')
    && (errors.userEmail === '')
    && (errors.userPassword === '')
    && (currentUser.userName !== '')
    && (currentUser.userEmail !== '')
    && (currentUser.userPassword !== '');

  // // // // // //
  //    стили    //
  // // // // // //

  const registerBtnClassName = `register__button ${(!isFormValid || !isEditMode) ? ' register__button_disabled' : ''}`;

  // // // // // //
  //   ФУНКЦИИ   //
  // // // // // //

  const handleChange = (event) => {
    handleUserFormChange(event, currentUser, setCurrentUser, errors, setErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsEditMode(false); // Блокирую форму перед отправкой данных
    try {
      await onSubmit(); // Ожидаю завершения отправки
    } catch (error) {
      console.error('Ошибка при отправке формы: ', error);
    } finally {
      setIsEditMode(true); // Разблокирую форму после получения ответа от сервера
    }
  };

  // // // // // //
  //   ЭФФЕКТЫ   //
  // // // // // //

  useEffect(() => {
    onResetApiError(); // эффект очистки ошибки будет вызван только при монтировании компонента
    return () => {
      onResetApiError(); // Этот код очистки будет выполнен при РАЗмонтировании
    };
  }, []);

  return (
    <main className="register">

      <section className="register__top">
        <a href="/"><img className="register__logo" src={logoPath} alt="лого" /></a>
        <h1 className="register__heading">Добро пожаловать!</h1>
      </section>

      <form className="register__form" onSubmit={handleSubmit} noValidate>
        <span className="register__input-label">Имя</span>
        <input
          value={currentUser.userName || ''}
          className="register__input register__input-name"
          onChange={handleChange}
          id="name-input"
          name="userName"
          type="text"
          placeholder="Имя"
          readOnly={!isEditMode}
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
          readOnly={!isEditMode}
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
          readOnly={!isEditMode}
        />
        <span className="register__input-error register__input-error_password">
          {errors.userPassword}
        </span>

        <div className="register__buttons-group">
          <span className="register__submit-error">{apiError}</span>
          <button disabled={(!isFormValid || !isEditMode)} className={registerBtnClassName} type="submit">Зарегистрироваться</button>
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
