import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';

function ProtectedRouteElement({ element: Component, ...props }) {
  // если выполняются 2 условия:
  //    1) уже залогинен.
  //    2) идет на логин или регистрацию,
  if (props.isLoggedIn && (Component === Login || Component === Register)) {
    // то отправляю на главную и ВЫХОЖУ из функции, НЕ выполняя дальнейшие действия
    return (<Navigate to="/" replace />);
  }
  // ИНАЧЕ - когда ломится на любой защищенный роут КРОМЕ логина или регистрацию,
  // то проверяю залогинен ли юзер
  //   - если НЕ залогинен, то отправляю на главную с любого защищенного роута
  //   - если уже залогинен, то отдаю компонент
  return (props.isLoggedIn
    ? <Component {...props} />
    : <Navigate to="/" replace />);
}

export default ProtectedRouteElement;
