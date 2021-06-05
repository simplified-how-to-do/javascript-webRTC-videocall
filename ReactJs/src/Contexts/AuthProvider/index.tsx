import React from 'react';
import {
  IAuthProviderSignInProps,
  IAuthProviderSession,
  IAuthProviderUser,
} from './types';

export interface IAuthContext {
  user: IAuthProviderUser;
  session: IAuthProviderSession;
  signIn({ email, password }: IAuthProviderSignInProps): Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(
  undefined
);

const AuthProvider: React.FC = ({ children }) => {
  const [state, setAuthContext] = React.useState({ user: {}, session: {} });

  async function signIn({ email, password }: IAuthProviderSignInProps) {
    if (email && password) {
      const response = { email, password, id: 1 };
      if (response?.id) {
        setAuthContext({ user: { email, password }, session: {} });
      }
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
