export type AuthMode = 'CREDENTIALS' | 'SSO';

export interface LoginCredentials {
  username?: string;
  password?: string;
  ssoProvider?: string;
}
