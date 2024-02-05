import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';

function ProtectedRouteElement({ element: Component, ...props }) {
  // если идет на логин или регистрацию,
  if (Component === Login || Component === Register) {
    // то проверяю залогинен ли.
    // - залогиненных отправляю на главную,
    // - остальным отдаю компонент.
    // и ВЫХОЖУ из функции, НЕ выполняя дальнейшие действия
    return (!props.isLoggedIn
      ? <Component {...props} />
      : <Navigate to="/" replace />);
  }
  // ИНАЧЕ - когда ломится на любой другой защищенный роут КРОМЕ логина или регистрацию,
  // то проверяю залогинен ли юзер
  //   - если НЕ залогинен, то отправляю на главную с любого защищенного роута
  //   - если уже залогинен, то отдаю компонент
  return (props.isLoggedIn
    ? <Component {...props} />
    : <Navigate to="/" replace />);
}

export default ProtectedRouteElement;
