import React from 'react';
import './MenuPopup.css';
import iconAvaRoundPath from '../../images/icon_ava_round.svg';

function MenuPopup(params) {
  const { onClose, isMenuPopupOpen } = params;

  const popupClassName = `menu-popup
  ${isMenuPopupOpen && 'menu-popup_active'}`;

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
              <a
                className="menu-popup__nav-link"
                href="http://ya.ru"
                target="_blank"
                rel="noreferrer"
              >
                Главная
              </a>
            </li>
            <li className="menu-popup__nav-item">
              <a
                className="menu-popup__nav-link menu-popup__nav-link_active"
                href="http://ya.ru"
                target="_blank"
                rel="noreferrer"
              >
                Фильмы
              </a>
            </li>
            <li className="menu-popup__nav-item">
              <a
                className="menu-popup__nav-link"
                href="http://ya.ru"
                target="_blank"
                rel="noreferrer"
              >
                Сохранённые фильмы
              </a>
            </li>
          </ul>
          {/* <h6>button</h6> */}
          <div className="menu-popup__account-btn">
            <div className="menu-popup__account-txt">Аккаунт</div>
            <img className="header__account-icon" src={iconAvaRoundPath} alt="иконка юзера" />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default MenuPopup;
