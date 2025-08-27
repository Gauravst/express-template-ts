import crypto from 'crypto';

export const hashData = (
  data: string,
  secretKey: string = process.env.HASH_HMAC_SECRET as string
): string => {
  return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
};
