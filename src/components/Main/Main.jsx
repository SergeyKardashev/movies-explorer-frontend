import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../Header/Header';
import Promo from './Promo/Promo';
import AboutProject from './AboutProject/AboutProject';
import Techs from './Techs/Techs';
import AboutMe from './AboutMe/AboutMe';
import Footer from '../Footer/Footer';
import MenuPopup from '../MenuPopup/MenuPopup';

function Main(props) {
  const { isLoggedIn } = props;
  // const { isLoggedIn, onLogOut } = props;

  const navigate = useNavigate();

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  const cbCloseMenuPopup = () => {
    setIsMenuPopupOpen(false);
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  const handleLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <>
      <MenuPopup
        onClose={cbCloseMenuPopup}
        isMenuPopupOpen={isMenuPopupOpen}
        onLogin={handleLogin}
      />
      <Header
        isDark
        isLoggedIn={isLoggedIn}
        onMenuClick={handleMenuClick}
        onLogin={handleLogin}
      />
      <Promo />
      <AboutProject />
      <Techs />
      <AboutMe />
      <Footer />
    </>
  );
}

export default Main;
