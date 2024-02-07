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
