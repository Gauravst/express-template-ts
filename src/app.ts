// package imports
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// module imports
import { BASEPATH } from './constants';
import { errorHandler } from './middlewares/error.middleware';
import { ApiResponse } from './utils/ApiResponse';
import { ApiError } from './utils/ApiError';

// router imports
import authRouters from './routes/auth.routes.js';

// constants
const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get(`${BASEPATH}/healthcheck`, (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(new ApiResponse(200, 'ok'));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, (error as Error).message));
  }
});


// auth & user routes
app.use(`${BASEPATH}/auth`, authRouters);

// error middleware
app.use(errorHandler);

export { app };
