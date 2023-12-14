import React, { useState } from 'react';
import './Profile.css';

function Profile(props) {
  const {
    user, onChange, onLogOut, onSubmit,
  } = props;

  const { userName, userEmail } = user;

  const [isEditMode, setIsEditMode] = useState(false);

  const editBtnClassName = `profile__btn profile__btn_edit
  ${isEditMode ? 'profile__btn_hidden' : ''}`;

  const saveBtnClassName = `profile__btn profile__btn_save
  ${!isEditMode ? 'profile__btn_hidden' : ''}`;

  const logoutBtnClassName = `profile__btn profile__btn_logout
  ${isEditMode ? 'profile__btn_hidden' : ''}`;

  function onEdit() {
    setIsEditMode(true);
  }

  return (
    <section className="profile">
      <h1 className="profile__title">{`Привет, ${userName}!`}</h1>
      <div className="profile__form-wrap">
        <form
          className="profile__form"
          onSubmit={onSubmit}
        >
          <div className="profile__input-wrap">
            <label htmlFor="name" className="profile__label">
              Имя
              <input
                name="userName"
                className="profile__input"
                value={userName}
                onChange={onChange}
                type="text"
                id="name"
                minLength="2"
                maxLength="40"
                required
                readOnly={!isEditMode}
              />
            </label>
          </div>
          <div className="profile__input-wrap">
            <label htmlFor="email" className="profile__label">
              E&#8209;mail
              <input
                name="userEmail"
                className="profile__input"
                value={userEmail}
                onChange={onChange}
                type="email"
                id="email"
                minLength="2"
                maxLength="40"
                required
                readOnly={!isEditMode}
              />
            </label>
          </div>

          <div className="profile__buttons-group">
            <button
              className={editBtnClassName}
              onClick={onEdit}
              type="button"
            >
              Редактировать
            </button>
            <button
              className={saveBtnClassName}
              type="submit"
            >
              Сохранить
            </button>
            <button
              className={logoutBtnClassName}
              onClick={onLogOut}
              type="button"
            >
              Выйти из аккаунта
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

export default Profile;
