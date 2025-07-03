import { Request } from 'express';
import { Socket } from 'net';
import { ParsedQs } from 'qs';

export interface ExpressRequest<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  ip: string;
  connection: Socket;
  headers: Request['headers'] & {
    'user-agent'?: string;
  };
  protocol: 'http' | 'https';
  secure: boolean;
  originalUrl: string;
  baseUrl: string;
  path: string;
  hostname: string;
  method: string;
  query: ReqQuery;
  url: string;
}
