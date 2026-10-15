import { useEffect } from 'react';
import { AppShell } from './components/layout/app-shell/AppShell';
import { LoginPage } from './pages/login/LoginPage';
import { useAuthStore } from './stores/auth-store';

export default function App() {
  const { isAuthenticated, validateSession } = useAuthStore();

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppShell />;
}
