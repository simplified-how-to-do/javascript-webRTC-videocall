import 'dotenv';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

import './shared/database';

import routes from './routes';
import AppError from '@errors/AppError';
import uploadConfig from '@config/uploadConfig';
import { createServer as httpCreateServer } from 'http';
import IoServer from 'IoServer';

const app = express();
const httpServer = httpCreateServer(app);
new IoServer(httpServer);

app.use(helmet());
app.use(
  cors({
    origin: '*',
    // origin: process.env.CORS_URL,
  })
);

app.use(express.json());

app.use(routes);

app.use('/files', express.static(uploadConfig.storagePath));

// app.use((err: Error, _req: Request, res: Response) => {
//   if (err instanceof AppError) {
//     try {
//       return res.status(err.statusCod).json({
//         status: 'error',
//         message: err.message,
//         userFriendly: err?.userFriendly,
//       });
//     } catch {
//       // empty
//     }
//   }

//   console.error(err);

//   return res.status(500).json({
//     status: 'error',
//     message: 'Internal server error',
//   });
// });

httpServer.listen(3333);
