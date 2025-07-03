import { ExpressRequest } from '@/modules/auth/providers/interfaces';

export const deviceFingerprint = (req: ExpressRequest): string => {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ??
    req.ip ??
    req.connection?.remoteAddress ??
    'unknown';

  const userAgent: string =
    typeof req.headers['user-agent'] === 'string'
      ? req.headers['user-agent']
      : '';

  return `${ip}_${userAgent}`;
};
