import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hashData } from '../utils/hash';
import { removeCookie, setCookie } from '../utils/cookies';
import { client } from '../config/prisma';
import { generateRandomToken } from '../utils/token';
import { AuthUser } from '../types/user';

interface CustomRequest extends Request {
  user?: any;
  api?: any;
}

// auth using token and API key
export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;
  const APIKey = req.params?.key;
  const origin = req.headers.origin;

  try {
    if (!APIKey) {
      if (!origin) {
        return res.status(500).json({ message: 'CORS not found' });
      }

      if (origin !== process.env.CLIENT_URL) {
        return res.status(403).json({ message: 'CORS, Blocked by Server' });
      }

      if (!accessToken || !refreshToken) {
        return res.status(401).json({ message: 'Unauthorized Request' });
      }

      // check accessToken here
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } else {
      // check auth here using API token
      const apiData = await client.apiKey.findUnique({
        where: { key: APIKey },
        include: { user: true },
      });

      if (!apiData || !apiData?.isActive) {
        res.status(401).json({ message: 'Invalid API Key' });
      }

      req.user = apiData?.user;
      req.api = apiData;
      next();
    }
  } catch (error: any) {
    if (refreshToken && error.name === 'TokenExpiredError') {
      const hashedRefreshToken = hashData(refreshToken);
      if (!hashedRefreshToken) {
        // remove all the token in cookies and logout here from db
        removeCookie(res, 'refreshToken');
        removeCookie(res, 'accessToken');
      }

      // get refreshToken here in db
      const data = await client.loginSession.findUnique({
        where: { token: hashedRefreshToken },
        include: { user: true },
      });

      // if Invalid logout here
      if (!data || !data?.isActive) {
        removeCookie(res, 'refreshToken');
        removeCookie(res, 'accessToken');

        if (data) {
          await client.loginSession.delete({
            where: { token: hashedRefreshToken },
          });
        }

        return res.status(401).json({ message: 'Invalid Request' });
      }

      const userData: AuthUser = {
        id: data.user.id,
        role: data.user.role,
        email: data.user.email,
      };

      // if valid give new accessToken and refreshToken
      const newRefreshToken = generateRandomToken(15);
      const newHashedRefreshToken = hashData(newRefreshToken);
      const newAccessToken = jwt.sign(userData, process.env.JWT_SECRET as string, {
        expiresIn: '15m',
      });

      // setup new refreshToken
      await client.loginSession.create({
        data: {
          userId: data.user.id,
          token: newHashedRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      setCookie(res, 'accessToken', newAccessToken, 30 * 24 * 60 * 60 * 1000);
      setCookie(res, 'refreshToken', newRefreshToken, 30 * 24 * 60 * 60 * 1000);
      req.user = userData;
      return next();
    } else if (APIKey) {
      return res.status(401).json({ message: 'Unauthorized Request, Invalid API Key' });
    }
    return res.status(500).json({ message: `Error : ${error}` });
  }
};
