import { FactoryProvider, Scope } from '@nestjs/common';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';
import { RESPONSE } from '../constants';

export const ResponseProvider: FactoryProvider = {
  provide: RESPONSE,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (req: Request & { res?: Response }): Response => {
    if (!req.res) {
      throw new Error('Response object is not attached to the request');
    }
    return req.res;
  },
};
