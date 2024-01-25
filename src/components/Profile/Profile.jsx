import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import handleUserFormChange from '../../utils/handleUserFormChange';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { updateUserApi } from '../../utils/MainApi';
import processUser from '../../utils/processUser';

function Profile(props) {
  const { onLogOut } = props;

  const navigate = useNavigate();

  const currentUserState = useContext(CurrentUserContext);
  const [currentUser, setCurrentUser] = currentUserState;
  const [errors, setErrors] = useState({ userName: ' ', userEmail: ' ', userPassword: ' ' });
  const [liveUser, setLiveUser] = useState(currentUser);
  // Лайв Юзер - замена стейту Юзера из главного компонента. Для управляемых инпутов.
  // В главном компоненте стейт автоматом пишет в ЛС. Тут это вредит.
  // Т.к. любое изменение инпутов зря записывается в ЛС.
  // Юзер из главного компонента нужен только для сабмита.
  // const [liveUser, setLiveUser] = useState(initialUser);

  // МОЖНО РАССМОТРЕТЬ useRef ВМЕСТО initialUser
  // useRef создает объект, который неизменный на протяжении всего жизненного цикла компонента.
  // Т.е.значение .current в ref-объекте можно изменять без вызова ререндера компонента.
  // Идеален для хранения значений, которые нужно сохранить на протяжении всего жизненного
  // цикла компонента, но изменение которых не должно вызывать перерисовку интерфейса.
  // Например, хранить предыдущее значения пропса/состояния, или хранить ссылки на DOM-элемент.

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  // обновляю стейт кнопки только после изменения юзера (привязан к полям)
  // Каждый раз, когда данные юзера обновляются, выполняется хук, проверяющий и тд
  useEffect(() => {
    const dataChanged = liveUser.userName !== currentUser.userName
      || liveUser.userEmail !== currentUser.userEmail;
    setIsDataUpdated(dataChanged);
  }, [liveUser]);

  const editBtnClassName = `profile__btn profile__btn_edit
  ${isEditMode ? ' profile__btn_hidden' : ''}`;

  const saveBtnClassName = `profile__btn profile__btn_save
  ${!isDataUpdated ? ' profile__btn_disabled' : ''}
  ${!isEditMode ? ' profile__btn_hidden' : ''}`;

  const logoutBtnClassName = `profile__btn profile__btn_logout
  ${isEditMode ? 'profile__btn_hidden' : ''}`;

  // проверяю изменились ли данные юзера
  const checkIfDataUpdated = (newUser) => {
    // ставлю стейт кнопки в ТРУ если 1 из свойств отличается от стартового
    setIsDataUpdated(newUser.userName !== currentUser.userName
      || newUser.userEmail !== currentUser.userEmail);
  };

  // передаю колбэк проверки
  const handleChange = (event) => {
    handleUserFormChange(event, liveUser, setLiveUser, errors, setErrors, checkIfDataUpdated);
  };

  const cbUpdateUser = async (userData) => {
    // шлю правки юзера в АПИ. Если ответ ОК - обновляю юзера хуком (стейт и ЛС) и на главную.
    try {
      const rawUser = await updateUserApi(userData);
      const precessedUser = processUser(rawUser);
      setCurrentUser(precessedUser);
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error); // 🔴 Если ответ НЕ ок, НЕ иду на главную, ошибка над кнопкой.
    }
  };

  function onEdit() { setIsEditMode(true); }

  function handleSubmitUpdateProfile(e) {
    e.preventDefault();
    cbUpdateUser(liveUser);
  }

  return (
    <main className="profile">
      <h1 className="profile__title">{`Привет, ${currentUser.userName}!`}</h1>
      <div className="profile__form-wrap">
        <form className="profile__form" onSubmit={handleSubmitUpdateProfile}>
          <div className="profile__input-wrap">
            <label htmlFor="name" className="profile__label">
              Имя
              <input
                name="userName"
                className="profile__input"
                value={liveUser.userName}
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
