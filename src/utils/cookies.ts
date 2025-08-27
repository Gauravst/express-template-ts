import { Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const setCookie = (res: Response, name: string, value: string, maxAge: number) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge,
    path: '/',
  });
};

export const removeCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
};
