// URI base path
export const BASEPATH: string = '/v1';

// Local http PORT
export const PORT: number = 5000;

// Cookie options
export const cookieOptions: {
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'none' | 'lax' | 'strict';
  path: string;
  maxAge: number;
} = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
  path: '/',
  maxAge: 864000000, // 10 days
};
