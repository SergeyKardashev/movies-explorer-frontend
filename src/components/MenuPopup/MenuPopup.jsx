import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
// import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './MenuPopup.css';
import iconAvaRoundPath from '../../images/icon_ava_round.svg';

function MenuPopup(props) {
  const { onClose, isMenuPopupOpen } = props;
  // let {  } = props;

  // const closeMenu = () => {
  //   isMenuPopupOpen = false;
  // };

  const navigate = useNavigate();
  // const location = useLocation();

  const popupClassName = `menu-popup
  ${isMenuPopupOpen ? 'menu-popup_active' : ''}`;

  // const navLinkMainClassName = `menu-popup__nav-link
  // ${location.pathname === '/' ? 'menu-popup__nav-link_active' : ''}`;

  // const navLinkFMoviesClassName = `menu-popup__nav-link
  // ${location.pathname === '/movies' ? 'menu-popup__nav-link_active' : ''}`;

  // const navLinkFSavedMoviesClassName = `menu-popup__nav-link
  // ${location.pathname === '/saved-movies' ? 'menu-popup__nav-link_active' : ''}`;

  const goToProfile = () => {
    navigate('/profile', { replace: false }); // исправить на тру
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
            <div className="menu-popup__account-txt">Аккаунт</div>
            <img className="header__account-icon" src={iconAvaRoundPath} alt="иконка юзера" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default MenuPopup;
