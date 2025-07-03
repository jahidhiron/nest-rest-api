import { AuthorEntity } from '@/modules/author/entities';

export interface ICurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role?: string;
  author?: AuthorEntity;
}
