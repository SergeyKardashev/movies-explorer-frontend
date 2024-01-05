import React, { useState, useEffect } from 'react';
import './Profile.css';
import handleUserFormChange from '../utils/handleUserFormChange';

function Profile(props) {
  const {
    user, setUser, onLogOut, onSubmit,
  } = props;

  const { userName, userEmail } = user;

  const [errors, setErrors] = useState({ userName: ' ', userEmail: ' ', userPassword: ' ' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataUpdated, setDataUpdated] = useState(false);

  const initialUser = JSON.parse(localStorage.getItem('user'));
  const initialUserName = initialUser.userName;
  const initialUserEmail = initialUser.userEmail;

  // обновляю состояние кнопки только после изменения данных юзера(привязаны к полям)
  // Каждый раз, когда данные юзера обновляются, выполняется хук, проверяющий и тд
  useEffect(() => {
    const dataChanged = user.userName !== initialUserName || user.userEmail !== initialUserEmail;
    setDataUpdated(dataChanged);
  }, [user, initialUserName, initialUserEmail]);

  const editBtnClassName = `profile__btn profile__btn_edit
  ${isEditMode ? ' profile__btn_hidden' : ''}`;

  const saveBtnClassName = `profile__btn profile__btn_save
  ${!isDataUpdated ? ' profile__btn_disabled' : ''}
  ${!isEditMode ? ' profile__btn_hidden' : ''}`;

  const logoutBtnClassName = `profile__btn profile__btn_logout
  ${isEditMode ? 'profile__btn_hidden' : ''}`;

  // Функция проверки изменились ли данные юзера
  const checkDataUpdated = (updatedUser) => {
    // создаю булеву переменную чтоб скормить стейту кнопки
    const dataChanged = updatedUser.userName !== initialUserName
      || updatedUser.userEmail !== initialUserEmail;
    setDataUpdated(dataChanged); // устанавливаю стейт dataUpdated кнопки
  };

  // обновленная функция, передающая колбэк проверки
  const handleChange = (event) => {
    handleUserFormChange(event, user, setUser, errors, setErrors, checkDataUpdated);
  };

  function onEdit() { setIsEditMode(true); }

  return (
    <main className="profile">
      <h1 className="profile__title">{`Привет, ${userName}!`}</h1>
      <div className="profile__form-wrap">
        <form className="profile__form" onSubmit={onSubmit}>
          <div className="profile__input-wrap">
            <label htmlFor="name" className="profile__label">
              Имя
              <input
                name="userName"
                className="profile__input"
                value={user.userName}
                onChange={handleChange}
                type="text"
                id="name"
                placeholder="Имя"
                minLength="2"
                maxLength="40"
                required
                readOnly={!isEditMode}
              />
            </label>
          </div>
          <span className="profile__input-error profile__input-error_email">
            {errors.userName}
          </span>

          <div className="profile__input-wrap">
            <label htmlFor="email" className="profile__label">
              E&#8209;mail
              <input
                name="userEmail"
                className="profile__input"
                value={userEmail}
                onChange={handleChange}
                type="email"
                id="email"
                placeholder="E-mail"
                required
                readOnly={!isEditMode}
              />
            </label>
          </div>
          <span className="profile__input-error profile__input-error_email">
            {errors.userEmail}
          </span>

          <div className="profile__buttons-group">
            <span className="profile__submit-error">Тут будет сообщение ошибки сабмита</span>
            <button className={editBtnClassName} onClick={onEdit} type="button">
              Редактировать
            </button>
            <button disabled={!isDataUpdated} className={saveBtnClassName} type="submit">
              Сохранить
            </button>
            <button className={logoutBtnClassName} onClick={onLogOut} type="button">
              Выйти из аккаунта
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default Profile;
