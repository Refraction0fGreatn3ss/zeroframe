import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { DEFAULT_PASSWORD_PLACEHOLDER, DEFAULT_USERNAME, SSO_PROVIDER } from '../login.data';
import type { AuthMode, LoginCredentials } from '../login.types';

export const usePrimaryLogin = (login: (credentials: LoginCredentials) => Promise<unknown>) => {
  const [authMode, setAuthMode] = useState<AuthMode>('CREDENTIALS');
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD_PLACEHOLDER);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (authMode === 'CREDENTIALS') {
      await login({ username, password });
    } else {
      await login({ ssoProvider: SSO_PROVIDER });
    }
  };

  return { authMode, setAuthMode, username, setUsername, password, setPassword, handleSubmit };
};
