/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthorRepository } from '../author.repository';
import { AuthorEntity } from '../../entities';

/**
 * Mock createQueryBuilder helper
 */
const qbMockFactory = () => ({
  getManyAndCount: jest.fn(),

  getOne: jest.fn(),
});

jest.mock('@/helpers', () => ({
  createQueryBuilder: jest.fn(),
}));

import { createQueryBuilder as mockedCreateQB } from '@/helpers';

/**
 * Mock TypeORM Repository returned by dataSource.getRepository
 */
const repoMock = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};

/**
 * A very lightweight fake DataSource – all we need is getRepository().
 */
const dataSourceStub = {
  getRepository: jest.fn().mockReturnValue(repoMock),
} as unknown as DataSource;

const baseAuthor = {
  id: 1,
  firstName: 'Jane',
  lastName: 'Austen',
  bio: 'English novelist',
  birthDate: new Date('1775-12-16'),
} as AuthorEntity;

describe('AuthorRepository (with real BaseRepository)', () => {
  let authorRepo: AuthorRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    (mockedCreateQB as jest.Mock).mockImplementation(qbMockFactory);

    authorRepo = new AuthorRepository(dataSourceStub);
  });

  it('initialises with the data source and entity', () => {
    expect(dataSourceStub.getRepository).toHaveBeenCalledWith(AuthorEntity);
  });

  it('creates an author entity', async () => {
    repoMock.create.mockReturnValueOnce(baseAuthor);
    repoMock.save.mockResolvedValueOnce(baseAuthor);

    const result = await authorRepo.create(baseAuthor);

    expect(repoMock.create).toHaveBeenCalledWith(baseAuthor);
    expect(repoMock.save).toHaveBeenCalledWith(baseAuthor);
    expect(result).toEqual(baseAuthor);
  });

  it('updates an existing author and returns the merged entity', async () => {
    const patch = { bio: 'Updated bio' };
    const merged = { ...baseAuthor, ...patch };

    repoMock.findOne.mockResolvedValueOnce(baseAuthor);
    repoMock.merge.mockReturnValueOnce(merged);
    repoMock.save.mockResolvedValueOnce(merged);

    const result = await authorRepo.update({ id: 1 }, patch);

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.merge).toHaveBeenCalledWith(baseAuthor, patch);
    expect(repoMock.save).toHaveBeenCalledWith(merged);
    expect(result).toEqual(merged);
  });

  it('returns null when updating a non-existent author', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const result = await authorRepo.update({ id: 999 }, { bio: 'x' });

    expect(repoMock.save).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('removes and returns an author', async () => {
    repoMock.findOne.mockResolvedValueOnce(baseAuthor);
    repoMock.delete.mockResolvedValueOnce(undefined);

    const result = await authorRepo.remove({ id: 1 });

    expect(repoMock.delete).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(baseAuthor);
  });

  it('returns null when removing a non-existent author', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const result = await authorRepo.remove({ id: 999 });

    expect(repoMock.delete).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('finds a single author via createQueryBuilder', async () => {
    const qb = qbMockFactory();
    qb.getOne.mockResolvedValueOnce(baseAuthor);
    (mockedCreateQB as jest.Mock).mockReturnValueOnce(qb);

    const result = await authorRepo.findOne({ query: { id: 1 } });

    expect(mockedCreateQB).toHaveBeenCalledWith(
      expect.objectContaining({
        alias: 'author',
        query: { id: 1 },
      }),
    );
    expect(result).toEqual(baseAuthor);
  });

  it('finds authors with pagination meta via createQueryBuilder', async () => {
    const qb = qbMockFactory();
    qb.getManyAndCount.mockResolvedValueOnce([[baseAuthor], 1]);
    (mockedCreateQB as jest.Mock).mockReturnValueOnce(qb);

    const result = await authorRepo.findAll({ page: 1, size: 10 });

    expect(mockedCreateQB).toHaveBeenCalledWith(
      expect.objectContaining({
        alias: 'author',
        page: 1,
        size: 10,
      }),
    );

    expect(result).toEqual({
      collection: [baseAuthor],
      meta: {
        total: 1,
        pages: 1,
        currentPage: 1,
      },
    });
  });

  it('throws BadRequestException for invalid sort input', async () => {
    await expect(
      authorRepo.findAll({ sort: { whom: 'x', order: 'asc' } as any }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
