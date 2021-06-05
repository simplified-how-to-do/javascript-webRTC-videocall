import React from 'react';

import AuthProvider from './AuthProvider';
import LayoutProvider from './LayoutProvider';

const Contexts: React.FC = ({ children, ...rest }) => {
  return (
    <AuthProvider {...rest}>
      <LayoutProvider>{children}</LayoutProvider>
    </AuthProvider>
  );
};

export default Contexts;
