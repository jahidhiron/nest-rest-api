export interface UserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role?: string;
}
