export interface ICatchError {
  name: string;
  message: string;
  code?: string | number;
  stack?: string;
  status?: number;
  [key: string]: any;
}
