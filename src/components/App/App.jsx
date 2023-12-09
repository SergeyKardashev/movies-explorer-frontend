import React from 'react';
import './App.css';
import Header from '../Header/Header';
import Promo from '../Main/Promo/Promo';
import AboutProject from '../Main/AboutProject/AboutProject';
import Techs from '../Main/Techs/Techs';

function App() {
  return (
    <>
      {/* В светлой теме. isDark = false */}

      {/* <Header isDark={false} isLoggedIn /> */}

      <Header isDark isLoggedIn={false} />

      {/* <Header isDark isLoggedIn /> */}
      <Promo />
      <AboutProject />
      <Techs />
    </>
  );
}

export default App;
