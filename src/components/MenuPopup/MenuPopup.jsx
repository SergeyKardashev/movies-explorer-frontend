import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './MenuPopup.css';
import iconAvaRoundPath from '../../images/icon_ava_round.svg';

function MenuPopup(props) {
  const { onClose, isMenuPopupOpen } = props;

  const navigate = useNavigate();

  const popupClassName = `menu-popup
  ${isMenuPopupOpen ? 'menu-popup_active' : ''}`;

  const goToProfile = () => {
    navigate('/profile', { replace: false }); // не удаляю из истории перемещение
    onClose();
  };

  return (
    <div className={popupClassName}>
      <div className="menu-popup__pad">
        <button
          className="menu-popup__close-button"
          onClick={onClose}
          type="button"
          aria-label="кнопка закрытия меню"
        />
        <nav className="menu-popup__nav-wrap">
          <ul className="menu-popup__nav-list">
            <li className="menu-popup__nav-item">
              <NavLink to="/" onClick={onClose} className={({ isActive }) => `menu-popup__nav-link ${isActive ? 'menu-popup__nav-link_active' : ''}`}>
                Главная
              </NavLink>
            </li>
            <li className="menu-popup__nav-item">
              <NavLink to="/movies" onClick={onClose} className={({ isActive }) => `menu-popup__nav-link ${isActive ? 'menu-popup__nav-link_active' : ''}`}>
                Фильмы
              </NavLink>
            </li>
            <li className="menu-popup__nav-item">
              <NavLink to="/saved-movies" onClick={onClose} className={({ isActive }) => `menu-popup__nav-link ${isActive ? 'menu-popup__nav-link_active' : ''}`}>
                Сохранённые фильмы
              </NavLink>
            </li>
          </ul>
          <button className="menu-popup__account-btn" onClick={goToProfile} type="button">
            <span className="menu-popup__account-txt">Аккаунт</span>
            <img className="menu-popup__account-icon" src={iconAvaRoundPath} alt="иконка юзера" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default MenuPopup;
