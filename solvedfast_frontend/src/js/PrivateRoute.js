// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/404" />;
};

export default PrivateRoute;