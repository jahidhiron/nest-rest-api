/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RemoveAuthorProvider } from '../remove-author.provider';
import { AuthorRepository } from '../../repositories';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { AuthorEntity } from '../../entities';
import { HttpException } from '@nestjs/common';

describe('RemoveAuthorProvider', () => {
  let provider: RemoveAuthorProvider;
  let authorRepository: jest.Mocked<AuthorRepository>;
  let errorService: jest.Mocked<ErrorService>;

  const mockAuthor: AuthorEntity = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'English novelist',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  beforeEach(async () => {
    authorRepository = {
      remove: jest.fn(),
    } as any;

    errorService = {
      notFound: jest.fn().mockImplementation(() => {
        throw new HttpException('Not Found', 404);
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveAuthorProvider,
        { provide: AuthorRepository, useValue: authorRepository },
        { provide: ErrorService, useValue: errorService },
      ],
    }).compile();

    provider = module.get(RemoveAuthorProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('removes an author and returns the entity', async () => {
    authorRepository.remove.mockResolvedValueOnce(mockAuthor);

    const result = await provider.execute(1);

    expect(authorRepository.remove).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockAuthor);
  });

  it('throws not found error when author does not exist', async () => {
    authorRepository.remove.mockResolvedValueOnce(null);

    await expect(provider.execute(999)).rejects.toMatchObject({ status: 404 });

    expect(authorRepository.remove).toHaveBeenCalledWith({ id: 999 });
    expect(errorService.notFound).toHaveBeenCalledWith(
      ModuleName.Author,
      'author-not-found',
    );
  });

  it('propagates repository errors', async () => {
    const err = new Error('DB error');
    authorRepository.remove.mockRejectedValueOnce(err);

    await expect(provider.execute(1)).rejects.toThrow(err);
  });
});
