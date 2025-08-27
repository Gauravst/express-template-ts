// package imports
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// module imports
import { BASEPATH } from './constants';
import { errorHandler } from './middlewares/error';
import { ApiResponse } from './utils/api-response';
import { ApiError } from './utils/api-error';

// router imports
import authRouters from './routes/auth';

// constants
const app = express();

// middlewares
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: true, // allow all origins (handle CORS using middleware)
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get(`${BASEPATH}/healthcheck`, (_: Request, res: Response, next: NextFunction) => {
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
