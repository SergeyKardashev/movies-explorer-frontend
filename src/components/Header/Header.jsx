import React from 'react';
import {
  useNavigate, useLocation, NavLink,
} from 'react-router-dom';
import './Header.css';
import logoPath from '../../images/logo.svg';
import iconAvaRoundPath from '../../images/icon_ava_round.svg';

function Header(props) {
  const {
    isLoggedIn, onMenuClick, urlWithHeaderFooter,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();

  /*  Подготовьте необходимые маршруты:
    /  /movies  /saved-movies   /profile  /signin   /signup   */

  if (!urlWithHeaderFooter.includes(location.pathname)) {
    return null;
  }

  let isDark = false;
  if (location.pathname === '/') {
    isDark = true;
  }

  const headerClassName = `header ${isDark ? 'header_dark' : ''}`;
  const headerNavClassName = `header__nav ${!isLoggedIn ? 'header__nav_hidden' : ''}`;

  // const headerNavLinkClassName = `header__nav-link
  // ${isDark ? 'header__nav-link_dark' : ''}  `;

  const headerAccountBtnClassName = `header__account-btn
  ${isDark ? 'header__account-btn_dark' : ''}
  ${!isLoggedIn ? 'header__account-btn_hidden' : ''}`;

  const headerMenuClassName = `header__menu
  ${isDark ? 'header__menu_dark' : ''}
  ${!isLoggedIn ? 'header__menu_hidden' : ''}`;

  const headerAuthClassName = `header__auth
  ${isLoggedIn ? 'header__auth_hidden' : ''}
  ${!isDark ? 'header__auth_hidden' : ''}`;

  return (
    <header className={headerClassName}>
      <a href="/">
        <img className="logo" src={logoPath} alt="Лого" />
      </a>

      <nav className={headerNavClassName}>
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <NavLink
              to="/movies"
              className={({ isActive }) => `header__nav-link
                ${isDark ? 'header__nav-link_dark' : ''}
                ${isActive ? 'header__nav-link_active' : ''}`}
            >
              Фильмы
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink
              to="/saved-movies"
              className={({ isActive }) => `header__nav-link
                ${isDark ? 'header__nav-link_dark' : ''}
                ${isActive ? 'header__nav-link_active' : ''}`}
            >
              Сохранённые фильмы
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* =========== кнопка Аккаунт =========== */}
      <button
        className={headerAccountBtnClassName}
        onClick={() => { navigate('/profile', { replace: true }); }}
        type="button"
      >
        <div className="header__account-txt">Аккаунт</div>
        <img className="header__account-icon" src={iconAvaRoundPath} alt="иконка юзера" />
      </button>

      {/* =========== Гамбургер Меню =========== */}
      <button
        className={headerMenuClassName}
        type="button"
        aria-label="меню"
        onClick={onMenuClick}
      />

      <div className={headerAuthClassName}>
        <button
          className="header__signup"
          type="button"
          onClick={() => { navigate('/signup', { replace: false }); }}
        >
          Регистрация
        </button>

        <button
          className="header__signin"
          type="button"
          onClick={() => { navigate('/signin', { replace: false }); }}
        >
          Войти
        </button>
      </div>
    </header>
  );
}

export default Header;
