import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute — blocks access if not authenticated or not admin.
 * Props:
 *   requireAuth: boolean (default true)
 *   requireAdmin: boolean (default false)
 *   redirectTo: string (default '/auth')
 */
export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/auth',
}) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131313]">
        <div className="font-agency text-4xl font-bold italic text-[#dbb462] animate-pulse">
          ZENITH
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
