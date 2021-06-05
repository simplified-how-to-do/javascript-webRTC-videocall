import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Contexts from './Contexts';
import Routes from './Routes';

import GlobalStyle from './styles/global';

const App: React.FC = () => {
  return (
    <>
      <Contexts>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Contexts>
      <GlobalStyle />
    </>
  );
};

export default App;
