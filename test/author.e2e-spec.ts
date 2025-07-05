/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestApp } from './test-app.setup';
import { signupAndSignin } from './auth.e2e-helper';
import { AuthorEntity } from '@/modules/author/entities';

let app: INestApplication;
let dataSource: DataSource;
let authorAccessToken: string;
let adminAccessToken: string;
const authorInvalidAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
let authorData: AuthorEntity;

beforeAll(async () => {
  app = await createTestApp();
  dataSource = app.get(DataSource);

  const { accessToken: aTok, data } = await signupAndSignin(app, {
    firstName: 'Test',
    lastName: 'Author',
    email: 'testauthor@example.com',
    password: 'TestPassword123',
    role: 'author',
  });
  authorAccessToken = aTok;
  authorData = data.user;

  await signupAndSignin(app, {
    firstName: 'Author',
    lastName: 'One',
    email: 'author1@example.com',
    password: 'TestPassword123',
    role: 'author',
  });
  await signupAndSignin(app, {
    firstName: 'Author',
    lastName: 'Two',
    email: 'author2@example.com',
    password: 'TestPassword123',
    role: 'author',
  });

  const { accessToken: admTok } = await signupAndSignin(app, {
    firstName: 'Test',
    lastName: 'Admin',
    email: 'testadmin@example.com',
    password: 'TestPassword123',
    role: 'admin',
  });
  adminAccessToken = admTok;
});

afterAll(async () => {
  await dataSource.synchronize(true);
  await app.close();
});

// authentication
describe('Author Module (e2e)', () => {
  it('/auth/signin (POST) - author should authenticate successfully', () => {
    expect(authorAccessToken).toBeTruthy();
  });

  it('/auth/signin (POST) - admin should authenticate successfully', () => {
    expect(adminAccessToken).toBeTruthy();
  });
});

// update author
describe('Author Module (e2e)', () => {
  // authentication
  it('/auth/signin (POST) - author should authenticate successfully', () => {
    expect(authorAccessToken).toBeTruthy();
  });

  it('/auth/signin (POST) - admin should authenticate successfully', () => {
    expect(adminAccessToken).toBeTruthy();
  });

  it('PATCH /api/v1/authors/:id – author updates own profile (200)', async () => {
    const payload = {
      firstName: 'David',
      lastName: 'Hassuy',
      bio: 'Test Bio updated',
      birthDate: '1990-07-02',
    };

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/authors/${authorData.id}`)
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .send(payload)
      .expect(200);

    expect(res.body).toMatchObject({
      success: true,
      method: 'PATCH',
      status: 'OK',
      statusCode: 200,
      path: `/api/v1/authors/${authorData.id}`,
      message: 'Author updated successful',
      data: {
        id: authorData.id,
        ...payload,
        birthDate: expect.stringContaining('1990-07-02'),
      },
    });
  });

  it('PATCH /api/v1/authors/:id  missing token (401)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/authors/${authorData.id}`)
      .send({ firstName: 'NoToken' })
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'PATCH',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Authentication token is required',
      path: `/api/v1/authors/${authorData.id}`,
    });
  });

  it('PATCH /api/v1/authors/:id – invalid token (401)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/authors/${authorData.id}`)
      .set('Authorization', `Bearer ${authorInvalidAccessToken}`)
      .send({ firstName: 'BadToken' })
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'PATCH',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Unauthorized',
      path: `/api/v1/authors/${authorData.id}`,
    });
  });

  it('PATCH /api/v1/authors/:id – author updates another author (401)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/v1/authors/2')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .send({ firstName: 'Hacker' })
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'PATCH',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Permission denied',
      path: '/api/v1/authors/2',
    });
  });

  it('PATCH /api/v1/authors/:id – admin updates author (200)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/v1/authors/2')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ bio: 'Admin‑edited bio' })
      .expect(200);

    expect(res.body.data).toMatchObject({
      id: 2,
      bio: 'Admin‑edited bio',
    });
  });

  it('PATCH /api/v1/authors/:id – author not found (404)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/v1/authors/999')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ firstName: 'Ghost' })
      .expect(404);

    expect(res.body).toMatchObject({
      success: false,
      method: 'PATCH',
      status: 'NOT_FOUND',
      statusCode: 404,
      message: 'Author not found',
      path: '/api/v1/authors/999',
    });
  });
});

// detail author
describe('GET /api/v1/authors - list authors', () => {
  it('GET /api/v1/authors/:id - should return author detail (200)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/1')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .expect(200);

    expect(res.body).toMatchObject({
      success: true,
      method: 'GET',
      status: 'OK',
      statusCode: 200,
      path: '/api/v1/authors/1',
      message: 'Get author detail successful',
      data: {
        id: 1,
        firstName: expect.any(String),
        lastName: expect.any(String),
        bio: expect.any(String),
        birthDate: expect.any(String),
      },
    });
  });

  it('GET /api/v1/authors/:id - should fail without token (401)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/1')
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'GET',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Authentication token is required',
      path: '/api/v1/authors/1',
    });
  });

  it('GET /api/v1/authors/:id - should fail with invalid token (401)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/1')
      .set('Authorization', `Bearer ${authorInvalidAccessToken}`)
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'GET',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Unauthorized',
      path: '/api/v1/authors/1',
    });
  });

  it('GET /api/v1/authors/:id - should fail if author accesses another author (401)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/2')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      method: 'GET',
      status: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Permission denied',
      path: '/api/v1/authors/2',
    });
  });

  it('GET /api/v1/authors/:id - should fail if author not found (404)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/999')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .expect(404);

    expect(res.body).toMatchObject({
      success: false,
      method: 'GET',
      status: 'NOT_FOUND',
      statusCode: 404,
      message: 'Author not found',
      path: '/api/v1/authors/999',
    });
  });

  it('GET /api/v1/authors/:id - admin should access any author detail', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors/2')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('id', 2);
  });
});

// author list
describe('GET /api/v1/authors - list authors', () => {
  it('should return paginated author list (200)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(res.body).toMatchObject({
      success: true,
      method: 'GET',
      status: 'OK',
      statusCode: 200,
      path: '/api/v1/authors',
      message: 'Get author list successful',
    });

    const { authors, meta } = res.body.data;
    expect(Array.isArray(authors)).toBe(true);
    expect(meta).toMatchObject({
      total: expect.any(Number),
      pages: expect.any(Number),
      currentPage: 1,
    });

    expect(authors.length).toBe(meta.total);
  });

  it('should respect page & size query params', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors?page=1&size=2')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(res.body.data.meta).toMatchObject({
      currentPage: 1,
      pages: Math.ceil(res.body.data.meta.total / 2),
    });

    expect(res.body.data.authors.length).toBeLessThanOrEqual(2);
  });

  it('should sort authors (id desc)', async () => {
    const sortParam = encodeURIComponent('[{"whom":"id","order":"desc"}]');
    const res = await request(app.getHttpServer())
      .get(`/api/v1/authors?sort=${sortParam}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    const { authors } = res.body.data;

    expect(authors[0].id).toBeGreaterThanOrEqual(authors.at(-1).id);
  });

  it('should filter by free‑text search query', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors?q=Author')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    const { authors } = res.body.data;

    expect(
      authors.every(
        (a) => a.firstName.includes('Author') || a.lastName.includes('Author'),
      ),
    ).toBe(true);
  });

  it('should fail without token (401)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors')
      .expect(401);

    expect(res.body).toMatchObject({
      success: false,
      status: 'UNAUTHORIZED',
      statusCode: 401,
      path: '/api/v1/authors',
      message: 'Authentication token is required',
    });
  });

  it('should fail with invalid token (401)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${authorInvalidAccessToken}`)
      .expect(401);

    expect(res.body.message).toBe('Unauthorized');
  });

  it('should return 401 if role is insufficient', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/authors')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .expect(401);

    expect(res.body.message).toBe('Permission denied');
  });
});

describe('DELETE /api/v1/authors/:id (delete author)', () => {
  it('admin deletes any author (204)', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/authors/2`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(204);
  });

  it('fails without token (401)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/authors/${authorData.id}`)
      .expect(401);

    expect(res.body).toMatchObject({
      method: 'DELETE',
      success: false,
      status: 'UNAUTHORIZED',
      statusCode: 401,
      path: `/api/v1/authors/${authorData.id}`,
      message: 'Authentication token is required',
    });
  });

  it('fails with invalid token (401)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/authors/${authorData.id}`)
      .set('Authorization', `Bearer ${authorInvalidAccessToken}`)
      .expect(401);

    expect(res.body).toMatchObject({
      method: 'DELETE',
      success: false,
      status: 'UNAUTHORIZED',
      statusCode: 401,
      path: `/api/v1/authors/${authorData.id}`,
      message: 'Unauthorized',
    });
  });

  it('fails when author tries to delete another author (401)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/authors/2')
      .set('Authorization', `Bearer ${authorAccessToken}`)
      .expect(401);

    expect(res.body).toMatchObject({
      method: 'DELETE',
      success: false,
      status: 'UNAUTHORIZED',
      statusCode: 401,
      path: '/api/v1/authors/2',
      message: 'Permission denied',
    });
  });

  it('fails when author not found (404)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/authors/9999')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(404);

    expect(res.body).toMatchObject({
      method: 'DELETE',
      success: false,
      status: 'NOT_FOUND',
      statusCode: 404,
      path: '/api/v1/authors/9999',
      message: 'Author not found',
    });
  });
});
