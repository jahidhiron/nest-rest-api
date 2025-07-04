/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindAuthorsProvider } from '../find-authors.provider';
import { AuthorRepository } from '../../repositories';
import { AuthorEntity } from '../../entities';
import { IRequestParams } from '@/common/interfaces';

describe('FindAuthorsProvider', () => {
  let provider: FindAuthorsProvider;
  let authorRepository: jest.Mocked<AuthorRepository>;

  const mockAuthor: AuthorEntity = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'English novelist',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  const repoResponse = {
    collection: [mockAuthor],
    total: 1,
    page: 1,
    size: 10,
  };

  beforeEach(async () => {
    authorRepository = {
      findAll: jest.fn().mockResolvedValue(repoResponse),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAuthorsProvider,
        { provide: AuthorRepository, useValue: authorRepository },
      ],
    }).compile();

    provider = module.get(FindAuthorsProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('returns authors and forwards params with raw search query', async () => {
    const params: IRequestParams = {
      page: 1,
      size: 10,
      sort: 'firstName',
      q: 'Jane',
      status: 'active',
    } as any;

    const result = await provider.execute(params);

    expect(authorRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { status: 'active' },
        page: 1,
        size: 10,
        sort: 'firstName',
        rawQueries: [
          expect.objectContaining({
            query: expect.stringContaining('LOWER(author.firstName'),
            q: '%jane%',
          }),
        ],
      }),
    );

    expect(result).toEqual({
      authors: repoResponse.collection,
      total: 1,
      page: 1,
      size: 10,
    });
  });

  it('works with no search term (empty rawQueries)', async () => {
    const params: IRequestParams = { page: 2, size: 5 } as any;

    await provider.execute(params);

    expect(authorRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        rawQueries: [],
        page: 2,
        size: 5,
      }),
    );
  });

  it('propagates repository errors', async () => {
    const err = new Error('db failure');
    authorRepository.findAll.mockRejectedValueOnce(err);

    await expect(provider.execute({} as any)).rejects.toThrow(err);
  });
});
