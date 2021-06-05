import React from 'react';
import { LayoutContext } from '../Contexts/LayoutProvider';
import { ILayoutContext } from '../Contexts/LayoutProvider/types';

const useLayoutContext = (): ILayoutContext => {
  const thisContext = React.useContext(LayoutContext);

  if (!thisContext) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }

  return thisContext;
};

export default useLayoutContext;
