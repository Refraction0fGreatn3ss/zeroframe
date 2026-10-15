import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { BootScreen } from './app/BootScreen';
import { createAppRouter } from './app/router';
import { startSessionLifecycle } from './app/session-lifecycle';
import { TenantGate } from './app/TenantGate';
import { LoginPage } from './pages/login/LoginPage';
import { useAuthStore } from './stores/auth-store';

export default function App() {
  const { status, validateSession } = useAuthStore();
  const [router] = useState(createAppRouter);

  useEffect(() => startSessionLifecycle(), []);

  useEffect(() => {
    void validateSession();
  }, [validateSession]);

  if (status === 'INITIALIZING') return <BootScreen />;
  if (status === 'UNAUTHENTICATED') return <LoginPage />;

  return (
    <TenantGate>
      <RouterProvider router={router} />
    </TenantGate>
  );
}
