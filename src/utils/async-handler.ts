import { Request, Response, NextFunction } from 'express';

// An HOF to reduce redundancy in the controllers.
export const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
