// User roles constants
export const availableUserRoles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  TRAINER: 'TRAINER'
} as const;
export type AvailableUserRoles = typeof availableUserRoles[keyof typeof availableUserRoles];
export const availableUserRolesEnum: AvailableUserRoles[] = Object.values(availableUserRoles);

// URI base path
export const BASEPATH: string = '/api/v1';

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
