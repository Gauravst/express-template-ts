// NOTE: Every controller should be wrapped inside the async handler for the consistency of code and request response cycle

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Logic will be written here
});
