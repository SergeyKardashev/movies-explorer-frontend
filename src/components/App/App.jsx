import React, { useState } from 'react';
import './App.css';
import Header from '../Header/Header';
import Promo from '../Main/Promo/Promo';
import AboutProject from '../Main/AboutProject/AboutProject';
import Techs from '../Main/Techs/Techs';
import AboutMe from '../Main/AboutMe/AboutMe';
import Footer from '../Footer/Footer';
import MenuPopup from '../MenuPopup/MenuPopup';

function App() {
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  const cbCloseMenuPopup = () => {
    setIsMenuPopupOpen(false);
  };

  const handleMenuClick = () => {
    setIsMenuPopupOpen(true);
  };

  return (
    <>
      <MenuPopup
        onClose={cbCloseMenuPopup}
        isMenuPopupOpen={isMenuPopupOpen}
      />
      <Header
        isDark
        isLoggedIn
        // isLoggedIn={false}
        onMenuClick={handleMenuClick}
      />
      <Promo />
      <AboutProject />
      <Techs />
      <AboutMe />
      <Footer />
      {/* <MenuPopup myParam="mmmmmyParammmmm" /> */}
    </>
  );
}

export default App;
