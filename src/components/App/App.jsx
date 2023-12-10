import React from 'react';
import './App.css';
import Header from '../Header/Header';
import Promo from '../Main/Promo/Promo';
import AboutProject from '../Main/AboutProject/AboutProject';
import Techs from '../Main/Techs/Techs';
import AboutMe from '../Main/AboutMe/AboutMe';
import Footer from '../Footer/Footer';

function App() {
  return (
    <>
      {/* В светлой теме. isDark = false */}
      {/* <Header isDark={false} isLoggedIn /> */}
      {/* <Header isDark isLoggedIn /> */}
      <Header isDark isLoggedIn={false} />
      <Promo />
      <AboutProject />
      <Techs />
      <AboutMe />
      <Footer />
    </>
  );
}

export default App;
