import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading security status...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Verifying permissions...</div>
      </div>
    );
  }

  // Double check authentication
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
