export interface IJwtPayload {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role?: string;
  iat?: number;
  exp?: number;
}
