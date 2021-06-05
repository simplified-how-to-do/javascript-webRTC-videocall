import { Router } from 'express';

import openRoutes from './openRoutes';
import userRoutes from './userRoutes';
import userAuthenticationMiddleware from './_infra/middlewares/userAuthenticationMiddleware';

const routes = Router();

routes.use('/open', openRoutes);
routes.use('/auth', userAuthenticationMiddleware, userRoutes);

export default routes;
