import React, { useState, useEffect } from 'react';
import './Profile.css';
import handleUserFormChange from '../utils/handleUserFormChange';

function Profile(props) {
  const {
    // user,
    // не нужен стейт юзера из главного компонента
    // setUser,
    onLogOut,
    onSubmit,
    initialUser,
  } = props;

  const [errors, setErrors] = useState({ userName: ' ', userEmail: ' ', userPassword: ' ' });

  // Лайв Юзер - замена стейту Юзера из главного компонента. Для управляемых инпутов.
  // В главном компоненте стейт автоматом пишет в ЛС. Тут это вредит.
  // Т.к. любое изменение инпутов зря записывается в ЛС.
  // Юзер из главного компонента нужен только для сабмита.
  const [liveUser, setLiveUser] = useState(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataUpdated, setDataUpdated] = useState(false);

  // const initialUser = JSON.parse(localStorage.getItem('user'));
  console.log('initialUserName', initialUser.userName);
  // обновляю стейт кнопки только после изменения юзера (привязан к полям)
  // Каждый раз, когда данные юзера обновляются, выполняется хук, проверяющий и тд
  useEffect(() => {
    const dataChanged = liveUser.userName !== initialUser.userName
      || liveUser.userEmail !== initialUser.userEmail;
    console.log('dataChanged: ', dataChanged);
    console.log('initial name:', initialUser.userName, '; live name:', liveUser.userName);

    setDataUpdated(dataChanged);
  }, [liveUser]);

  // useEffect(() => {
  //   const dataChanged = user.userName !== initialUser.userName
  //     || user.userEmail !== initialUser.userEmail;
  //   console.log('dataChanged: ', dataChanged);
  //   console.log('initialUserName', initialUser.userName, 'user.userName', user.userName);

  //   setDataUpdated(dataChanged);
  // }, [user]);

  // изменил отслеживаемое. Не помню причину следить за начальными значениями
  // }, [user, initialUserName, initialUserEmail]);

  const editBtnClassName = `profile__btn profile__btn_edit
  ${isEditMode ? ' profile__btn_hidden' : ''}`;

  const saveBtnClassName = `profile__btn profile__btn_save
  ${!isDataUpdated ? ' profile__btn_disabled' : ''}
  ${!isEditMode ? ' profile__btn_hidden' : ''}`;

  const logoutBtnClassName = `profile__btn profile__btn_logout
  ${isEditMode ? 'profile__btn_hidden' : ''}`;

  // Функция проверки изменились ли данные юзера
  const checkDataUpdated = (newUser) => {
    // ставлю стейт кнопки в ТРУ если 1 из свойств отличается от стартового
    setDataUpdated(newUser.userName !== initialUser.userName
      || newUser.userEmail !== initialUser.userEmail);
  };

  // обновленная функция, передающая колбэк проверки
  const handleChange = (event) => {
    handleUserFormChange(event, liveUser, setLiveUser, errors, setErrors, checkDataUpdated);
  };
  // const handleChange = (event) => {
  //   handleUserFormChange(event, user, setUser, errors, setErrors, checkDataUpdated);
  // };

  function onEdit() { setIsEditMode(true); }

  return (
    <main className="profile">
      <h1 className="profile__title">{`Привет, ${initialUser.userName}!`}</h1>
      {/* <h1 className="profile__title">{`Привет, ${user.userName}!`}</h1> */}
      <div className="profile__form-wrap">
        <form className="profile__form" onSubmit={onSubmit}>
          <div className="profile__input-wrap">
            <label htmlFor="name" className="profile__label">
              Имя
              <input
                name="userName"
                className="profile__input"
                value={liveUser.userName}
                // был стейт из АПП
                // value={user.userName}
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
                value={liveUser.userEmail}
                // value={user.userEmail}
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
