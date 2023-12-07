import React from 'react';
import './App.css';
import Header from '../Header/Header';
import Promo from '../Main/Promo/Promo';

function App() {
  return (
    <>
      {/* отправляю в верстку 3 компонента */}

      {/* первый - в темной теме. isDark без значения - по дефолту true */}
      {/* ======= logged OUT ====== */}
      {/* <Header isDark isLoggedIn={false} /> */}
      {/* В светлой теме. isDark = false */}
      {/* ======= logged in ====== */}
      {/* <Header isDark={false} isLoggedIn /> */}
      {/* ======= logged in ====== */}
      <Header isDark isLoggedIn />

      <Promo />
    </>
  );
}

export default App;
