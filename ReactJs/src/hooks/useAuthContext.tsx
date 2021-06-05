import React from 'react';
import { AuthContext, IAuthContext } from '../Contexts/AuthProvider';

const useAuthContext = (): IAuthContext => {
  const thisContext = React.useContext(AuthContext);

  if (!thisContext) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return thisContext;
};

export default useAuthContext;
