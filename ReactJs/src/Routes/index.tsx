import React from 'react';
import { Switch } from 'react-router-dom';

import * as pages from 'pages';
import AppRoute from './AppRoute';

const Routes: React.FC = () => {
  return (
    <Switch>
      <AppRoute path="/" exact component={pages.Home} />
      <AppRoute path="/login" component={pages.Login} />
      <AppRoute path="*" component={pages.NotFound} />
    </Switch>
  );
};

export default Routes;
