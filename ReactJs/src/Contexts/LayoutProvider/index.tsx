import React from 'react';
import { ILayoutContext, languageType, ThemeType } from './types';

export const LayoutContext = React.createContext<ILayoutContext | undefined>(
  undefined
);

const defaultState: Omit<ILayoutContext, 'setLanguage' | 'setTheme'> = {
  adminActions: {
    contentEditor: false,
  },
  language: 'pt-br',
  theme: 'lightTheme',
};

const LayoutProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState(defaultState);

  return (
    <LayoutContext.Provider
      value={{
        ...state,
        setLanguage(language: languageType) {
          setState((prev) => ({ ...prev, language }));
        },
        setTheme(theme: ThemeType) {
          setState((prev) => ({ ...prev, theme }));
        },
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
