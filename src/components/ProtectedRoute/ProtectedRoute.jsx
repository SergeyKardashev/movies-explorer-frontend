// import React from 'react';
// import { Navigate } from 'react-router-dom';

// function ProtectedRouteElement({ element: Component, ...props }) {
//   console.log('ProtectedRouteElement');
//   return (props.allowedToSee
//     ? <Component {...props} />
//     : <Navigate to="/" replace />);
// }

// export default ProtectedRouteElement;

// 🔴 вариант - добавить проверку url
// если урл = логину или регистрации, то кидать не на главную, а на фильмы

//
//
//
//
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// function ProtectedRouteElement({ element: Component, allowedToSee, ...props }) {
//   const location = useLocation();

//   // Если allowedToSee тру, то рисую компонент
//   if (allowedToSee && (location.pathname === '/signin' || location.pathname === '/signup')) {
//     return <Component {...props} />;
//   }
//   // Если allowedToSee ложно, то направляю на главную или на Логин в зависимости от контекста
//   return <Navigate to="/" replace />;
// }

// export default ProtectedRouteElement;
//
//
//
//
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// function ProtectedRouteElement({ element: Component, allowedToSee, ...props }) {
//   // Если allowedToSee тру, то рисую компонент
//   if (allowedToSee) {
//     return <Component {...props} />;
//   }
//   // Если allowedToSee ложно, то направляю на главную или на Логин в зависимости от контекста
//   return <Navigate to="/" replace />;
// }

// export default ProtectedRouteElement;
//
//
//
//
//
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRouteElement({
  element: Component,
  allowedToSee,
  redirectTo = '/', ...rest
}) {
  return allowedToSee ? <Component {...rest} /> : <Navigate to={redirectTo} replace />;
}

export default ProtectedRouteElement;
