import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { cookieOptions } from '../constants';
import { client } from '../config/prisma';
import { setCookie } from '../utils/cookies';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'user data'));
});

export const logoutUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const refreshToken = req.cookies.refreshToken;
  if (user && refreshToken) {
    await client.loginSession.delete({
      where: { userId: user.id, token: refreshToken },
    });
  }

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, 'user logged out'));
});

export const authCallback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.tokens) {
    throw new ApiError(401, 'Authentication failed');
  }

  const { accessToken, refreshToken } = req.user.tokens;
  setCookie(res, 'accessToken', accessToken, 30 * 24 * 60 * 60 * 1000);
  setCookie(res, 'refreshToken', refreshToken, 30 * 24 * 60 * 60 * 1000);
  return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});
