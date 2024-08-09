// This piece of code is responsible for the consistency of error responses.

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  // comparing if the error instance is not related to custom defined API error
  if (!(err instanceof ApiError)) {
    const statusCode =
      err.statusCode || err instanceof mongoose.Error ? 400 : 500;

    const message = err.message || 'Something went wrong';
    err = new ApiError(statusCode, message, err?.errors || []);
  }

  return res.status(err.statusCode).json({
    ...err,
    message: err.message,
  });
};
