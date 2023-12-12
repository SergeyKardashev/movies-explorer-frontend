import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logoPath from '../../images/logo.svg';
import iconAvaRoundPath from '../../images/icon_ava_round.svg';

function Header(props) {
  const {
    isDark, isLoggedIn, onMenuClick,
  } = props;

  const headerClassName = `header ${isDark && 'header_dark'}`;
  const headerNavClassName = `header__nav ${!isLoggedIn && 'header__nav_hidden'}`;

  const headerNavLinkClassName = `header__nav-link
  ${isDark && 'header__nav-link_dark'}`;

  const headerAccountBtnClassName = `header__account-btn
  ${isDark && 'header__account-btn_dark'}
  ${!isLoggedIn && 'header__account-btn_hidden'}`;

  const headerMenuClassName = `header__menu
  ${isDark && 'header__menu_dark'}
  ${!isLoggedIn && 'header__menu_hidden'}`;

  const headerAuthClassName = `header__auth
  ${isLoggedIn && 'header__auth_hidden'}
  ${!isDark && 'header__auth_hidden'}`;

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register', { replace: true });
  };

  const goToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <header className={headerClassName}>
      <img className="logo" src={logoPath} alt="Лого" />
      <nav className={headerNavClassName}>
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <a className={headerNavLinkClassName} href="https://ya.ru/">
              Фильмы
            </a>
          </li>
          <li className="header__nav-item">
            <a className={headerNavLinkClassName} href="https://ya.ru/">
              Сохранённые фильмы
            </a>
          </li>
        </ul>
      </nav>
      <div className={headerAccountBtnClassName}>
        <div className="header__account-txt">
          Аккаунт
        </div>
        <img className="header__account-icon" src={iconAvaRoundPath} alt="иконка юзера" />
      </div>
      <button
        className={headerMenuClassName}
        type="button"
        aria-label="меню"
        onClick={onMenuClick}
      />
      <div className={headerAuthClassName}>
        <button className="header__signup" type="button" onClick={goToRegister}>Регистрация</button>
        <button className="header__signin" type="button" onClick={goToLogin}>Войти</button>
      </div>
    </header>
  );
}

export default Header;
