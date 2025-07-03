import { FieldError } from './field.type';

export type ErrorResponse = {
  success: boolean;
  method: string;
  status: string;
  statusCode: number;
  path: string;
  message: string;
  timestamp: string;
  errors?: FieldError[];
  stack?: string;
};
