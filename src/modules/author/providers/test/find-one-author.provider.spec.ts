/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneAuthorProvider } from '../find-one-author.provider';
import { AuthorRepository } from '../../repositories';
import { AuthorEntity } from '../../entities';

describe('FindOneAuthorProvider', () => {
  let provider: FindOneAuthorProvider;
  let authorRepository: jest.Mocked<AuthorRepository>;

  const mockAuthor: AuthorEntity = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'English novelist',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  beforeEach(async () => {
    authorRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneAuthorProvider,
        { provide: AuthorRepository, useValue: authorRepository },
      ],
    }).compile();

    provider = module.get(FindOneAuthorProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('returns an author when found', async () => {
    authorRepository.findOne.mockResolvedValueOnce(mockAuthor);

    const result = await provider.execute({ id: 1 });

    expect(authorRepository.findOne).toHaveBeenCalledWith({
      query: { id: 1 },
    });
    expect(result).toEqual(mockAuthor);
  });

  it('returns null when no author is found', async () => {
    authorRepository.findOne.mockResolvedValueOnce(null);

    const result = await provider.execute({ id: 999 });

    expect(authorRepository.findOne).toHaveBeenCalledWith({
      query: { id: 999 },
    });
    expect(result).toBeNull();
  });

  it('throws when repository throws', async () => {
    const error = new Error('DB failure');
    authorRepository.findOne.mockRejectedValueOnce(error);

    await expect(provider.execute({ id: 1 })).rejects.toThrow(error);
  });
});
