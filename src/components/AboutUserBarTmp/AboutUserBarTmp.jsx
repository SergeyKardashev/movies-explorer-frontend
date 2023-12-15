import React, { useEffect } from 'react';

function AboutUserBarTmp(props) {
  const { user, isLoggedIn, setUserFromStorage } = props;

  useEffect(
    () => { setUserFromStorage(); },
    [],
  );

  return (
    <div>
      {`
      ${isLoggedIn ? '_вошел ✅' : '_Разлонинен 🔴  '}
      ${Array(20).fill('\xa0').join('')}
      ИМЯ: ${user.userName ? user.userName : ' 🔴  '}
      ${Array(20).fill('\xa0').join('')}
      ПОЧТА: ${user.userEmail ? user.userEmail : ' 🔴  '}
      ${Array(20).fill('\xa0').join('')}
      ПАРОЛЬ: ${user.userPassword ? user.userPassword : ' 🔴  '}
      `}
    </div>
  );
}

export default AboutUserBarTmp;
//
// не работает считывание из локал сторэджа
