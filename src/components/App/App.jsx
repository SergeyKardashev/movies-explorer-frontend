import React from 'react';
import './App.css';
import Header from '../Header/Header';

function App() {
  return (
    <>
      {/* отправляю в верстку 2 компонента */}

      {/* первый - в темной теме. isDark без значения - по дефолту true */}
      ======= logged OUT ======
      <Header isDark isLoggedIn={false} />
      ======= logged in ======
      <Header isDark isLoggedIn />

      {/* В светлой теме. isDark = false */}
      ======= logged in ======
      <Header isDark={false} isLoggedIn />
    </>
  );
}

export default App;
