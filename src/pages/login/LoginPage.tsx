import type { FC } from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { AuthModeTabs } from './components/AuthModeTabs';
import { AuthNotice } from './components/AuthNotice';
import { CredentialsForm } from './components/CredentialsForm';
import { LoginCardFooter } from './components/LoginCardFooter';
import { LoginCardHeader } from './components/LoginCardHeader';
import { LoginFooter } from './components/LoginFooter';
import { LoginTopBar } from './components/LoginTopBar';
import { SsoLoginPanel } from './components/SsoLoginPanel';
import { StepUpMfaForm } from './components/StepUpMfaForm';
import { usePrimaryLogin } from './hooks/use-primary-login';
import { useStepUpMfa } from './hooks/use-step-up-mfa';

export const LoginPage: FC = () => {
  const { login, stepUpMfa, isStepUpRequired, isLoading, authError, isAutoLoggedOut, inactivityPolicy } =
    useAuthStore();
  const { authMode, setAuthMode, username, setUsername, password, setPassword, handleSubmit } = usePrimaryLogin(login);
  const { totpCode, setTotpCode, stepUpError, handleStepUpSubmit } = useStepUpMfa(stepUpMfa);

  return (
    <div className="min-h-screen w-screen bg-[var(--zf-bg-app)] text-[var(--zf-text-primary)] flex flex-col justify-between p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <LoginTopBar />

      <main className="w-full max-w-md mx-auto my-auto z-10">
        <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          <LoginCardHeader />

          <AuthNotice isAutoLoggedOut={isAutoLoggedOut} inactivityPolicy={inactivityPolicy} authError={authError} />

          {isStepUpRequired ? (
            <StepUpMfaForm
              totpCode={totpCode}
              stepUpError={stepUpError}
              isLoading={isLoading}
              onTotpCodeChange={setTotpCode}
              onSubmit={handleStepUpSubmit}
            />
          ) : (
            <>
              <AuthModeTabs authMode={authMode} onSelect={setAuthMode} />

              {authMode === 'CREDENTIALS' ? (
                <CredentialsForm
                  username={username}
                  password={password}
                  isLoading={isLoading}
                  onUsernameChange={setUsername}
                  onPasswordChange={setPassword}
                  onSubmit={handleSubmit}
                />
              ) : (
                <SsoLoginPanel isLoading={isLoading} onSignIn={handleSubmit} />
              )}
            </>
          )}

          <LoginCardFooter />
        </div>
      </main>

      <LoginFooter />
    </div>
  );
};
