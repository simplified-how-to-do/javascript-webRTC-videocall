import useAuthContext from 'hooks/useAuthContext';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface IAppRoute extends RouteProps {
  isPrivate?: boolean;
}

const AppRoute: React.FC<IAppRoute> = ({ isPrivate, component, ...rest }) => {
  const { authorized } = useAuthContext()?.session;

  if (
    (isPrivate && !authorized) ||
    (typeof component !== 'function' && !React.isValidElement(component))
  ) {
    return <Redirect to="/" />;
  }

  return <>{<Route {...{ ...rest, component }} />}</>;
};

export default AppRoute;
