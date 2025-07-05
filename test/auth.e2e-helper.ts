/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { LoginResponse } from './interfaces';

export async function signupAndSignin(
  app: INestApplication,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  },
): Promise<{
  data: any;
  accessToken: string;
}> {
  // Signup
  await request(app.getHttpServer()).post('/api/v1/auth/signup').send(userData);

  // Signin
  const loginRes = await request(app.getHttpServer())
    .post('/api/v1/auth/signin')
    .send({ email: userData.email, password: userData.password });

  const loginData = loginRes?.body?.data as LoginResponse;

  return {
    data: loginData,
    accessToken: loginData?.token?.accessToken ?? null,
  };
}
