import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    if (role && !roles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (e) {
    console.error('JWT decode failed:', e);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
