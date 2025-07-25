// src/components/Shared/GuestOnlyRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Optional: redirect to dashboard based on role
    const role = JSON.parse(atob(token.split('.')[1]))?.roles?.[0];

    switch (role) {
      case 'ROLE_ADMIN':
        return <Navigate to="/admin-dashboard" />;
      case 'ROLE_TRAINER':
        return <Navigate to="/trainer-dashboard" />;
      case 'ROLE_MEMBER':
        return <Navigate to="/member-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default GuestOnlyRoute;
