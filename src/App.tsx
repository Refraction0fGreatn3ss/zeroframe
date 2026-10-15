/**
 * ZeroFrame Enterprise 1.0 Entry Point
 * Implements Strict Auth Gate & Session Management
 */

import React, { useEffect } from 'react';
import { useAuthStore } from './stores/auth-store';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  const { isAuthenticated, validateSession, isLoading } = useAuthStore();

  useEffect(() => {
    validateSession();
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppShell />;
}
